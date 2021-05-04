import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Client, DigitalTwinClient } from 'azure-iothub';
import { ManagedIdentityCredential, DefaultAzureCredential } from '@azure/identity'; 
import { DigitalTwinsClient } from "@azure/digital-twins-core";
const connectionString: string = process.env.IoTHubConnectionString;
const digitalTwinsUrl: string = process.env.digitalTwinsUrl;
const adtInstanceUrl: string = process.env.adtInstanceUrl

const moduleId: string = 'generatemessages';

interface parameters {
    deviceId: string,
    thresholdRed: number,
    thresholdYellow: number,
}

const createPatchObject = (path: string, value: number) => {
    return {
        "op": "replace",
        "path": path,
        "value": value
    }
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    const IoTHubClient: Client = Client.fromConnectionString(connectionString);
    const parameters: parameters = {
        deviceId: (req.query.deviceId || req.body && req.body.deviceId),
        thresholdYellow: (req.query.thresholdYellow || req.body && req.body.thresholdYellow),
        thresholdRed: (req.query.thresholdRed || req.body && req.body.thresholdRed),
    }
    console.log(parameters);
    if (!parameters.deviceId || !parameters.thresholdYellow || !parameters.thresholdRed) {
        context.res = {
            status: 400,
            body: {
                errMessage: 'please provide valid Data'
            }
        };
        return
    }

    const params = {
        methodName: 'co2lights',
        payload: JSON.stringify({
            thresholdRed: parameters.thresholdRed,
            thresholdYellow: parameters.thresholdYellow
        })
    }
    var result = await IoTHubClient.invokeDeviceMethod( parameters.deviceId, moduleId, params);
    context.log(result.result);
    if (result.result.status != 200) {
        context.res = {
            status: result.result.status,
            body: {
                message: result.result.payload
            }
        }
        return
    }

    const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    //const credentials = new DefaultAzureCredential();
    const digitalTwinsClient =  new DigitalTwinsClient(adtInstanceUrl, credentials);

    var jsonPatch = [];
    jsonPatch.push(createPatchObject('/co2ThresholdRed', parameters.thresholdRed));
    jsonPatch.push(createPatchObject('./co2ThresholdYellow', parameters.thresholdYellow));

    try {
        await digitalTwinsClient.updateDigitalTwin(parameters.deviceId, jsonPatch);
        context.log(`Updated Twin with Id of ${parameters.deviceId}`);
        context.res = {
            status: 200,
            body: {
                message: 'Successfully updated twin properties'
            }
        }

    } catch (err) {
        context.res = {
            status: 500,
            body: {
                message: err
            }
        }
    }

};

export default httpTrigger;