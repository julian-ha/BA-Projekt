import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { AzureFunction, Context } from "@azure/functions"
import { DefaultAzureCredential, ManagedIdentityCredential, UsernamePasswordCredential } from "@azure/identity";
import axios, { AxiosRequestConfig } from "axios";
import message from "./_interfaces/message";


const digitalTwinsUrl: string = process.env.digitalTwinsUrl;
const adtInstanceUrl: string = process.env.adtInstanceUrl;



const createPatchObject = (path: string, value: any) => {
    return {
        "op": "replace",
        "path": path,
        "value": value
    }
}

const sendToLogicApps = (message: message) => {
    return new Promise(async(resolve, reject) => {
        const endpoint = "https://prod-245.westeurope.logic.azure.com:443/workflows/120de8b4830346e2b435658fa2cbaf03/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vdqNa2rBRMc8FmVT_fCL0yKMDULfxp6xuPPFAQYupOc";
        var config: AxiosRequestConfig = {
            method: "post",
            url: endpoint,
            headers: { 
                'Content-Type': 'application/json'
              },
            data: JSON.stringify({
                deviceId: message.deviceId,
                temperature: message.temperature
            })
        }
        await axios(config)
        .then((response) => {
            resolve(response)
        })
        .catch((err) => {
           reject(err);
        })
    });

}

const createPatchObjectRoom = (message: message) => {
    var jsonPatch = [];
    jsonPatch.push(createPatchObject('/temperature', message.temperature));
    jsonPatch.push(createPatchObject('/humidity', message.humidity));
    jsonPatch.push(createPatchObject('/co2ThresholdRed', message.co2ThresholdRed)); 
    jsonPatch.push(createPatchObject('/co2ThresholdYellow', message.co2ThresholdYellow));
    jsonPatch.push(createPatchObject('/co2', message.co2));
    jsonPatch.push(createPatchObject('/voc', message.voc));
    jsonPatch.push(createPatchObject('/light', message.light));
    jsonPatch.push(createPatchObject('/loudness', message.loudness));

    return jsonPatch
}

const createPatchObjectPrinter = (message: message) => {
    var jsonPatch = [];
    jsonPatch.push(createPatchObject('/ambientTemperature', message.temperature));
    return jsonPatch
}

const IoTHubTrigger: AzureFunction = async function (context: Context, IoTHubMessages: message[]): Promise<void> {
    context.log(`Eventhub trigger function called for message array: ${IoTHubMessages}`);

    //Authorization (DefaultAzureCredential for Local Development)
    const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    //const credentials = new DefaultAzureCredential();
    const digitalTwinsClient = new DigitalTwinsClient(adtInstanceUrl, credentials);

    for await (var message of IoTHubMessages) {
        context.log(message)
        var jsonPatch;
        switch(message.deviceType) {
            case 'room':
                jsonPatch = createPatchObjectRoom(message);
                break;
            case 'printer':
                jsonPatch = createPatchObjectPrinter(message);
                context.bindings.savePrinterData = JSON.stringify(message);
                context.bindings.saveToBlob = JSON.stringify(message);
                if (message.temperature >= 25)  await sendToLogicApps(message);
                break;
        }
        context.log(jsonPatch);
        try {
            await digitalTwinsClient.updateDigitalTwin( message.deviceId, jsonPatch);
            context.log(`Updated Twin with Id: ${ message.deviceId }`);
        } catch (err) {
            context.log(err);
        }
    }

};



export default IoTHubTrigger; 
