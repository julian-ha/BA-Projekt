import { DigitalTwinsClient } from '@azure/digital-twins-core';
import { DefaultAzureCredential } from '@azure/identity';
import { ManagedIdentityCredential } from '@azure/identity';
import { AzureFunction, Context } from "@azure/functions"


const digitalTwinsUrl: string = process.env.digitalTwinsUrl;
const adtInstanceUrl: string = process.env.adtInstanceUrl;

const createPatchObject = (path: string, value: any) => {
    return {
        "op": "replace",
        "path": path,
        "value": value
    }
}

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    //context.log(typeof eventGridEvent);
    //context.log(eventGridEvent);


    const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    //const credentials = new DefaultAzureCredential();
    const digitalTwinsClient = new DigitalTwinsClient(adtInstanceUrl, credentials);

    var splittedSubject = eventGridEvent.subject.split('/');
    var deviceId = splittedSubject[1];

    if (eventGridEvent.eventType == 'Microsoft.Devices.DeviceConnected') {
        context.log(`Setting state to true for device: ${deviceId}`);
        var state = true;
    } else {
        context.log(`Seting state to false for device ${deviceId}`);
        var state = false;
    }
    
    try {
        await digitalTwinsClient.updateDigitalTwin(deviceId, [createPatchObject('/connectionState', state)]);
        context.log(`Updated Twin with Id: ${ deviceId }`);

    } catch (err) {
        context.log(err);
    }

};

export default eventGridTrigger;
