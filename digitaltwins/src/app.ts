import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env'});

import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { DefaultAzureCredential, UsernamePasswordCredential } from '@azure/identity';
import models from './_models/model';
import model from "./interfaces/model";
import relationship from './interfaces/relationship';
import twin from './interfaces/twin';
import twins from './_models/twins';
import relationships from './_models/relationships';


const adtInstanceUrl = process.env['adtInstanceUrl'] || '';
const tenantId = process.env['tenantId'] || '';
const clientId = process.env['clientId'] || '';


//var credentials = new identity.InteractiveBrowserCredential({clientId: clientId, tenantId: tenantId});

const username = "j.haering@enval.de";
const password = "Haselnuss&97"
//var credentials = new DefaultAzureCredential();
var credentials = new UsernamePasswordCredential(tenantId, clientId, username, password);
var client =  new DigitalTwinsClient(adtInstanceUrl, credentials);




const createModels = async (client: DigitalTwinsClient, models: model[]) => {
    for await (var model of models) {
        var modelExists = await isModelExisting(client, model['@id']);
        if (!modelExists) {
            try {
                await client.createModels([model]);
                console.info(`Created model with Id: ${model['@id']} `)
            } catch (err) {
                if (err.statusCode === 409) {
                    console.info(`Model with Id: ${ model['@id'] } already exists`);
                } else {
                    console.error(`An error occured creating a model with the Id: ${ model['@id'] }, err: ${ err }`);
                }
            }
        }
    }
}


const isModelExisting = async (client: DigitalTwinsClient, Id: string): Promise<Boolean> => {
    try {
        await client.getModel(Id);
        return true
    } catch (err) {
        //console.info(`Error when getting Model code: ${ err.code } statusCode: ${ err.statusCode }`)
        return false;
    }
}

const createTwin = async (client: DigitalTwinsClient, twins: twin[]) => {
    for await (var twin of twins) {
        var newTwin: any = {};
        newTwin =  {
            $dtId: twin.Id,
            $metadata: {
                $model: twin.modelId,
            }
        }

        for (var property of twin.properties) {
            newTwin[property.key] = property.value;
        }

        try {
            var createdTwin = await client.upsertDigitalTwin(newTwin.$dtId, JSON.stringify(newTwin));
            console.log(`created / updated Twin with Id: ${newTwin.$dtId}`); 
            } catch (err) {
                console.error(`An error occured creating a twin with the Id: ${ twin.Id }, err: ${ err.code }`);
                console.log(err); 
            }
        }
}






const createRelationship = async (relationships: relationship[]) => {
    var client1 = new DigitalTwinsClient(adtInstanceUrl, credentials);
    for await (var relationship of relationships) {
        try {
            
            var result = await client1.upsertRelationship(relationship.$sourceId, relationship.$relationshipId, relationship);
            console.log(`created relationship from ${ relationship.$sourceId } to ${ relationship.$targetId } with the name of ${ relationship.$relationshipName }`);
    
        } catch (err) {
            console.log(err);
        }
    } 
 
}





const listModels = async (client: DigitalTwinsClient) => {
     var result = await client.listModels();
     var models = [];
     for await (const model of result) {
       console.log(model);
       models.push(model);
     }
     return models
}




const queryTwin = async (client: DigitalTwinsClient, query: string) => {
    var result = await client.queryTwins(query);
    var twins = [];
    for await (var twin of result) {
        console.log(twin);
        twins.push(twin);
    }
    return twins
} 




var twin: twin[] = [{
    Id: 'blab',
    modelId: 'dtmi:com:planb:company;1a',
    properties: [
        {
            key: 'TaxID',
            value: "1234"
        }
    ]
}];


const run = async () => {
    //await createModels(client, models);
    //await createTwin(client, twins);
    console.log(await queryTwin(client, "SELECT * FROM DigitalTwins"));

    //await createRelationship(relationships);
    //await listModels(client);    
}
run(); 
