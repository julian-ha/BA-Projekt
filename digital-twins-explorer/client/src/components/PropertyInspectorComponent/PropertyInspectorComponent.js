// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { Component } from "react";
import { TextField } from "office-ui-fabric-react";
import { JsonEditor as Editor } from "jsoneditor-react";
import { compare, deepClone } from "fast-json-patch";

import LoaderComponent from "../LoaderComponent/LoaderComponent";
import { PropertyInspectorCommandBarComponent } from "./PropertyInspectorCommandBarComponent/PropertyInspectorCommandBarComponent";
import { PropertyInspectorPatchInformationComponent }
  from "./PropertyInspectorPatchInformationComponent/PropertyInspectorPatchInformationComponent";
import { print } from "../../services/LoggingService";
import { apiService } from "../../services/ApiService";
import { eventService } from "../../services/EventService";
import { signalRService } from "../../services/SignalRService";
import { ModelService } from "../../services/ModelService";

import "jsoneditor-react/es/editor.min.css";
import "./PropertyInspectorComponent.scss";
import "../ModalComponent/ModalComponent.scss";

const NonPatchableFields = [ "$dtId", "$etag", "$metadata", "telemetry" ];

const applyDefaultValues = (properties, selection) => {
  if (!selection || !properties) {
    return selection;
  }

  const modelService = new ModelService();
  for (const p of Object.keys(properties)) {
    if (!properties[p].schema) {
      if (!selection[p]) {
        selection[p] = {};
      }

      applyDefaultValues(properties[p], selection[p]);
      continue;
    }

    if (selection[p]) {
      continue;
    }

    const value = modelService.getPropertyDefaultValue(properties[p].schema);
    selection[p] = value;
  }

  return selection;
};

const reTypeDelta = (properties, delta) => {
  const modelService = new ModelService();
  for (const d of delta) {
    const parts = d.path.split("/").filter(x => x);

    let match = properties;
    for (const p of parts) {
      match = match[p];
      if (!match) {
        break;
      }
    }

    if (match && match.schema) {
      d.value = modelService.getPropertyDefaultValue(match.schema, d.value);
    }
  }

  return delta;
};

export class PropertyInspectorComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selection: null,
      selectionType: null,
      changed: false,
      patch: null,
      isLoading: false
    };
    this.editorRef = React.createRef();
    this.properties = null;
    this.original = null;
    this.updated = null;
    this.modelService = null;
  }

  get editor() {
    return this.editorRef.current ? this.editorRef.current.jsonEditor : null;
  }

  componentDidMount() {
    this.initializeModelService();
    this.subscribeSelection();
    this.subscribeTelemetry();
    eventService.subscribeCreateModel(this.initializeModelService);
    eventService.subscribeDeleteModel(this.initializeModelService);
  }

  initializeModelService = () => {
    this.modelService = new ModelService();
  }

  subscribeTelemetry = () => {
    signalRService.subscribe("telemetry", telemetry => {
      const { selection } = this.state;
      if (telemetry && telemetry.dtId === selection.$dtId) {
        const appendedSelection = {...selection};
        appendedSelection.telemetry = telemetry.data;
        this.setState({ selection: appendedSelection });
        this.original.telemetry = this.updated.telemetry = telemetry.data;
        this.editor.update(this.updated);
      }
    });
  }

  subscribeSelection = () => {
    eventService.subscribeSelection(async payload => {
      if (payload) {
        const { selection, selectionType } = payload;
        if (selectionType === "twin") {
          let properties = null;
          try {
            properties = selection ? await this.modelService.getProperties(selection.$metadata.$model) : null;
          } catch (exc) {
            print(`*** Error fetching twin properties: ${exc}`, "error");
          }
          this.properties = properties;
          this.original = this.updated = selection ? await applyDefaultValues(this.properties, deepClone(selection)) : null;
        } else if (selectionType === "relationship") {
          this.original = this.updated = selection ? selection : null;
        }
        this.setState({ changed: false, selection, patch: null, selectionType }, () => {
          if (payload && payload.selection) {
            this.editor.set(this.original);
            const rootMetaIndex = this.editor.node.childs.findIndex(item => item.field.toLowerCase() === "$metadata");
            if (rootMetaIndex >= 0) {
              this.editor.node.childs[rootMetaIndex].expand(true);
            }
          }
        });
      } else {
        this.setState({ changed: false, selection: null, patch: null, selectionType: null });
      }
    });
  }

  showModal = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  onEditable = node => {
    const { selectionType } = this.state;
    if (node && node.field === "") {
      return { field: true, value: true };
    }

    if (node && selectionType === "twin") {
      let current = this.properties;
      for (const p of node.path) {
        if (NonPatchableFields.indexOf(p) > -1 || ("writable" in current && !current.writable)) {
          return { field: false, value: false };
        }

        current = current[p];
        if (!current) {
          break;
        }
      }
    }

    return { field: false, value: true };
  }

  handleEditorChange = data => {
    this.updated = data;
    this.setState({ changed: true });
  }

  onExpand = () => {
    this.editor.expandAll();
  }

  onCollapse = () => {
    this.editor.collapseAll();
  }

  onUndo = () => {
    this.editor.history.undo();
    if (this.editor.history.index < 0) {
      this.setState({ changed: false });
    }
  }

  onRedo = () => {
    this.editor.history.redo();
    if (this.editor.history.index >= 0) {
      this.setState({ changed: true });
    }
  }

  onSearchChange = (_, text) => {
    if (this.editor) {
      this.editor.search(text);
    }
  }

  onSave = async () => {
    const { changed, selection, selectionType } = this.state;
    if (changed && selectionType === "twin") {
      const deltaFromDefaults = compare(this.original, this.updated);
      const deltaFromOriginal = compare(selection, this.updated);
      const delta = reTypeDelta(this.properties, deltaFromOriginal.filter(x =>
        deltaFromDefaults.some(y => y.path === x.path)
          || deltaFromDefaults.some(y => y.path.startsWith(`${x.path}/`))));
      const modelService = new ModelService();
      try {
        modelService.validateTwinPatch(this.properties, delta);
        this.setState({ patch: delta });
        const patch = JSON.stringify(delta, null, 2);
        print("*** PI Changes:", "info");
        print(patch, "info");
        if (patch.length > 0) {
          await this.patchTwin(delta);
        }
        this.showModal();
        this.setState({ changed: false });
      } catch (exc) {
        exc.customMessage = "Error in patching twin";
        eventService.publishError(exc);
      }
    }
  }

  async patchTwin(res) {
    this.setState({ isLoading: true });
    try {
      print(`*** Patching twin ${this.original.$dtId}`, "info");
      await apiService.updateTwin(this.original.$dtId, res);
    } catch (exc) {
      exc.customMessage = "Error in patching twin";
      eventService.publishError(exc);
    }
    this.setState({ isLoading: false });
  }

  onClassName = ({ path }) => path.includes("telemetry") && path.length > 1 ? "jsoneditor-telemetry" : null

  render() {
    const { showModal, selection, changed, patch, isLoading, selectionType } = this.state;
    return (
      <div className="pi-gridWrapper">
        <div className="pi-grid">
          <PropertyInspectorCommandBarComponent buttonClass="pi-toolbarButtons"
            changed={changed}
            selection={selection}
            selectionType={selectionType}
            onExpand={() => this.onExpand()}
            onCollapse={() => this.onCollapse()}
            onUndo={() => this.onUndo()}
            onRedo={() => this.onRedo()}
            onSave={() => this.onSave()} />
          <TextField className="pi-filter" onChange={this.onSearchChange} placeholder="Search" />
          <div className="pi-editor">
            {selection && <Editor
              ref={this.editorRef}
              mainMenuBar={false}
              enableTransform={false}
              enableSort={false}
              history
              onEditable={this.onEditable}
              onChange={this.handleEditorChange}
              onClassName={this.onClassName} />}
          </div>
          <PropertyInspectorPatchInformationComponent isVisible={showModal} patch={patch} onCloseModal={this.closeModal} />
          {isLoading && <LoaderComponent />}
        </div>
      </div>
    );
  }

}
