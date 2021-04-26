import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { AzureFunction, Context } from "@azure/functions"
import { DefaultAzureCredential, ManagedIdentityCredential, UsernamePasswordCredential } from "@azure/identity";
import reading from "./_interfaces/reading";


const digitalTwinsUrl: string = "https://digitaltwins.azure.net";
const adtInstanceUrl: string = "https://twinju.api.weu.digitaltwins.azure.net";



const createPatchObject = (path: string, value: any) => {
    return {
        "op": "replace",
        "path": path,
        "value": value
    }
}

const IoTHubTrigger: AzureFunction = async function (context: Context, IoTHubMessages: reading[]): Promise<void> {
    context.log(`Eventhub trigger function called for message array: ${IoTHubMessages}`);

    //Authorization (DefaultAzureCredential for Local Development)
    //const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    const credentials = new DefaultAzureCredential();
    const client = new DigitalTwinsClient(adtInstanceUrl, credentials);

    for await (var reading of IoTHubMessages) {
        //create all Patch Objects
        var patchObject = createPatchObject('/temperature', reading.temperature);

        //make request with patchObjects
        try {
            var twinId: string = 'Besprechungsraum';
            await client.updateDigitalTwin( twinId,  [patchObject]);
            context.log(`Updated Twin with Id: ${ twinId } with Temperature Reading: ${ reading.temperature }`);
        } catch (err) {
            context.log(err);
        }
    }

};



export default IoTHubTrigger; 
