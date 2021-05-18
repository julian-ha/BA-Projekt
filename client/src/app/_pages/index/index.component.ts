import * as atlasIndoor from 'azure-maps-indoor';
import * as atlasMaps from 'azure-maps-control'
import { DigitalTwinsService } from './../../_services/digital-twins.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectMethodsService } from 'src/app/_services/direct-methods.service';
import { TwinData } from 'src/app/_models/twin-data';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})



export class IndexComponent implements OnInit, AfterViewInit {

  subscriptionKey: string = "cCdBlUlMYdAg124dF-cO2wPfUL7hoyiSVWWJilzgUYI";
  tilesetId: string = "70a11539-0fd7-45d2-fadc-c36094f386d9";
  statesetId: string = "388ed24b-8e5c-c867-b612-fb8c697317a7";

  mapSelection: string = "Temperatur"
  

  twins: any = [];
  map: any;
  displayedTwin: TwinData;
  adjustmentModal: boolean = false;
  loadingTwinData: boolean = false;

  thresholdForm: FormGroup;


  constructor(
    private digitalTwinsService: DigitalTwinsService,
    private formBuilder: FormBuilder,
    private DirectMethodsService: DirectMethodsService,
  ) {
   }

  ngOnInit(): void {

    
    this.initMap();
    this.thresholdForm = this.formBuilder.group({
      thresholdRed: [ 1000, Validators.required],
      thresholdYellow: [500 , Validators.required]
    });
  }

  ngAfterViewInit(): void {
    
  }

  public setStateset(event: string) {
    console.log(event);
    this.mapSelection = event;
  } 

  public initMap() {
    this.map = new atlasMaps.Map('indoormaps', {
      //use your facility's location
      center: [10.157215, 48.684948],
      //or, you can use bounds: [# west, # south, # east, # north] and replace # with your Map bounds
      style: "grayscale_dark",
      view: 'Auto',
      authOptions: { 
        authType: atlasMaps.AuthenticationType.subscriptionKey,
        subscriptionKey: this.subscriptionKey
      },
      zoom: 19,
    });

    this.map.events.add('ready', () => {
            //Construct a zoom control and add it to the map.
            this.map.controls.add(new atlasMaps.control.ZoomControl({
              style: atlasMaps.ControlStyle.light,
              zoomDelta: 1
            }), {position: atlasMaps.ControlPosition.BottomLeft});
      
            const levelControl = new atlasIndoor.control.LevelControl();
      
            const indoorManager = new atlasIndoor.indoor.IndoorManager(this.map, {
              levelControl: levelControl, //level picker
              tilesetId: this.tilesetId,
              statesetId: this.statesetId // Optional
            });
      
            if (this.statesetId.length > 0) {
              indoorManager.setDynamicStyling(true);
            }

          this.map.events.add("levelchanged", indoorManager, (eventData) => {
            //put code that runs after a level has been changed
            console.log("The level has changed:", eventData);
          });

          this.map.events.add("facilitychanged", indoorManager, (eventData) => {
            //put code that runs after a facility has been changed
            console.log("The facility has changed:", eventData);
          });

    });

          /* Upon a mouse click, log the feature properties to the browser's console. */

          this.map.events.add("click", (e) => {

            var features = this.map.layers.getRenderedShapes(e.position, "indoor");
            //change the values on clicking on room
            features.reduce(async (ids, feature) => {
                if (feature.layer.id != "footprint_boundary_fill") {
                  console.log(feature.properties.featureId);
                 // make reuquest
                  await this.getTwinData(feature.properties.featureId);
                } 

                
            }, []);
        });



  }


  public getTwinData(mapsName: string) {
    console.log(mapsName);
    this.twins = [];
    this.digitalTwinsService.getTwinByMapsName(mapsName)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log(response);
          response.forEach(element => {
            this.twins.push(element);
          });
          this.displayedTwin = this.twins[0];
          console.log(`this is the displayed twin ${this.displayedTwin}`);
          this.thresholdForm.controls.thresholdRed.setValue(this.displayedTwin.co2ThresholdRed);
          this.thresholdForm.controls.thresholdYellow.setValue(this.displayedTwin.co2ThresholdYellow);
        },
        (err) => {
          console.log(err);
          this.displayedTwin = null;
        }
      )
  }

  public onSubmit(event?: Event) {
    console.log('submit');

    if (this.thresholdForm.invalid) return 
    var data = {
      deviceId: this.displayedTwin.$dtId,
      thresholdRed: this.thresholdForm.controls.thresholdRed.value,
      thresholdYellow: this.thresholdForm.controls.thresholdYellow.value,
  }
  console.log(data);

    this.DirectMethodsService.sendDirectMethodThresholds(data)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log(response)
          this.adjustmentModal = false;
         
        },
        (err) => {
          console.log(err);
          console.log('fe');
        }
      )
  }





}
