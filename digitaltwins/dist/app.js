"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + '/.env' });
const digital_twins_core_1 = require("@azure/digital-twins-core");
const identity_1 = require("@azure/identity");
const model_1 = __importDefault(require("./_models/model"));
const twins_1 = __importDefault(require("./_models/twins"));
const relationships_1 = __importDefault(require("./_models/relationships"));
const adtInstanceUrl = process.env['adtInstanceUrl'] || '';
const tenantId = process.env['tenantId'] || '';
const clientId = process.env['clientId'] || '';
//var credentials = new identity.InteractiveBrowserCredential({clientId: clientId, tenantId: tenantId});
var credentials = new identity_1.DefaultAzureCredential();
var client = new digital_twins_core_1.DigitalTwinsClient(adtInstanceUrl, credentials);
const createModels = (client, models) => { var models_1, models_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        for (models_1 = __asyncValues(models); models_1_1 = yield models_1.next(), !models_1_1.done;) {
            var model = models_1_1.value;
            var modelExists = yield isModelExisting(client, model['@id']);
            if (!modelExists) {
                try {
                    yield client.createModels([model]);
                    console.info(`Created model with Id: ${model['@id']} `);
                }
                catch (err) {
                    if (err.statusCode === 409) {
                        console.info(`Model with Id: ${model['@id']} already exists`);
                    }
                    else {
                        console.error(`An error occured creating a model with the Id: ${model['@id']}, err: ${err}`);
                    }
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (models_1_1 && !models_1_1.done && (_a = models_1.return)) yield _a.call(models_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}); };
const isModelExisting = (client, Id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.getModel(Id);
        return true;
    }
    catch (err) {
        //console.info(`Error when getting Model code: ${ err.code } statusCode: ${ err.statusCode }`)
        return false;
    }
});
const createTwin = (client, twins) => { var twins_2, twins_2_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_2, _a;
    try {
        for (twins_2 = __asyncValues(twins); twins_2_1 = yield twins_2.next(), !twins_2_1.done;) {
            var twin = twins_2_1.value;
            var newTwin = {};
            newTwin = {
                $dtId: twin.Id,
                $metadata: {
                    $model: twin.modelId,
                }
            };
            for (var property of twin.properties) {
                newTwin[property.key] = property.value;
            }
            try {
                var createdTwin = yield client.upsertDigitalTwin(newTwin.$dtId, JSON.stringify(newTwin));
                console.log(`created / updated Twin with Id: ${newTwin.$dtId}`);
            }
            catch (err) {
                console.error(`An error occured creating a twin with the Id: ${twin.Id}, err: ${err.code}`);
                console.log(err);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (twins_2_1 && !twins_2_1.done && (_a = twins_2.return)) yield _a.call(twins_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
}); };
const createRelationship = (client, relationships) => { var relationships_2, relationships_2_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_3, _a;
    var result;
    try {
        for (relationships_2 = __asyncValues(relationships); relationships_2_1 = yield relationships_2.next(), !relationships_2_1.done;) {
            var relationship = relationships_2_1.value;
            console.log(relationship);
            try {
                result = yield client.upsertRelationship(relationship.$sourceId, relationship.$relationshipId, relationship);
                console.log(`created relationship from ${relationship.$sourceId} to ${relationship.$targetId} with the name of ${relationship.$relationshipName}`);
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (relationships_2_1 && !relationships_2_1.done && (_a = relationships_2.return)) yield _a.call(relationships_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
}); };
const listModels = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var e_4, _a;
    var result = yield client.listModels();
    var models = [];
    try {
        for (var result_1 = __asyncValues(result), result_1_1; result_1_1 = yield result_1.next(), !result_1_1.done;) {
            const model = result_1_1.value;
            console.log(model);
            models.push(model);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (result_1_1 && !result_1_1.done && (_a = result_1.return)) yield _a.call(result_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return models;
});
const queryTwin = (client, query) => __awaiter(void 0, void 0, void 0, function* () {
    var e_5, _b;
    var result = yield client.queryTwins(query);
    var twins = [];
    try {
        for (var result_2 = __asyncValues(result), result_2_1; result_2_1 = yield result_2.next(), !result_2_1.done;) {
            var twin = result_2_1.value;
            console.log(twin);
            twins.push(twin);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (result_2_1 && !result_2_1.done && (_b = result_2.return)) yield _b.call(result_2);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return twins;
});
var twin = [{
        Id: 'blab',
        modelId: 'dtmi:com:planb:company;1a',
        properties: [
            {
                key: 'TaxID',
                value: "1234"
            }
        ]
    }];
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    yield createModels(client, model_1.default);
    yield createTwin(client, twins_1.default);
    //console.log(await queryTwin(client, "SELECT * FROM DigitalTwins"));
    yield createRelationship(client, relationships_1.default);
    //await listModels(client);    
});
run();
