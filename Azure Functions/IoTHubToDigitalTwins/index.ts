import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { AzureFunction, Context } from "@azure/functions"
import { DefaultAzureCredential, ManagedIdentityCredential, UsernamePasswordCredential } from "@azure/identity";
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

const IoTHubTrigger: AzureFunction = async function (context: Context, IoTHubMessages: message[]): Promise<void> {
    context.log(`Eventhub trigger function called for message array: ${IoTHubMessages}`);

    //Authorization (DefaultAzureCredential for Local Development)
    //const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    const credentials = new DefaultAzureCredential();
    const digitalTwinsClient = new DigitalTwinsClient(adtInstanceUrl, credentials);

    for await (var message of IoTHubMessages) {
        context.log(message);
        //create all Patch Objects
        var jsonPatch = [];
        jsonPatch.push(createPatchObject('/temperature', message.temperature));
        jsonPatch.push(createPatchObject('/humidity', message.humidity));
        jsonPatch.push(createPatchObject('/co2ThresholdRed', message.co2ThresholdRed)); 
        jsonPatch.push(createPatchObject('/co2ThresholdYellow', message.co2ThresholdYellow));
        jsonPatch.push(createPatchObject('/co2', message.co2));
        jsonPatch.push(createPatchObject('/voc', message.voc));
        jsonPatch.push(createPatchObject('/light', message.light));
        jsonPatch.push(createPatchObject('/loudness', message.loudness));

        //make request with patchObjects
        try {
            await digitalTwinsClient.updateDigitalTwin( message.deviceId, jsonPatch);
            context.log(`Updated Twin with Id: ${ message.deviceId } with Temperature Reading: ${ message.temperature }`);
        } catch (err) {
            context.log(err);
        }
    }

};



export default IoTHubTrigger; 
