import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Client } from 'azure-iothub';

const connectionString: string = "HostName=hubiotju.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=wMrMO3XuY93kn0SPwoo4P1kKspdPi8cBEwIP8UbHs2c="

const moduleId: string = 'generatemessages';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    const IoTHubClient: Client = Client.fromConnectionString(connectionString);

    const payload = {
        test: 'test von Nodejs',
        number: 1
    }
    const params = {
        methodName: 'testmethod',
        payload: JSON.stringify(payload)
    }
    var result = await IoTHubClient.invokeDeviceMethod('DeviceJuHa', moduleId, params);
    context.log(result.result);

    context.res = {
        status: result.result.status,
        body: {
            message: result.result.payload
        }
    };

};

export default httpTrigger;