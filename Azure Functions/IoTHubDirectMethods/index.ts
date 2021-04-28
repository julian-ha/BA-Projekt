import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Client } from 'azure-iothub';

const connectionString: string = process.env.IoTHubConnectionString;

const moduleId: string = 'generatemessages';

interface parameters {
    deviceId: string,
    thresholdRed: number,
    thresholdYellow: number,
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


    const payload = {
        thresholdRed: parameters.thresholdRed,
        thresholdYellow: parameters.thresholdYellow
    }
    const params = {
        methodName: 'co2lights',
        payload: JSON.stringify(payload)
    }
    var result = await IoTHubClient.invokeDeviceMethod( parameters.deviceId, moduleId, params);
    context.log(result.result);

    context.res = {
        status: result.result.status,
        body: {
            message: result.result.payload
        }
    };

};

export default httpTrigger;