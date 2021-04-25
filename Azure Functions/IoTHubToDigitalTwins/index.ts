import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { AzureFunction, Context } from "@azure/functions"
import { ManagedIdentityCredential, UsernamePasswordCredential } from "@azure/identity";
import reading from "./_interfaces/reading";


const digitalTwinsUrl: string = "https://digitaltwins.azure.net";
const adtInstanceUrl: string = "https://twinju.api.weu.digitaltwins.azure.net";
const clientId: string = "3caee8fc-f185-4f3c-92f4-48f104c86476";
const tenantId: string = "be46afd0-8a22-40d5-8e63-b9f3282bcb2e";
const username: string = "j.haering@enval.de";
const password: string = "Haselnuss&97";


const createPatchObject = (path: string, value: any) => {
    return {
        "op": "replace",
        "path": path,
        "value": value
    }
}

const IoTHubTrigger: AzureFunction = async function (context: Context, IoTHubMessages: reading[]): Promise<void> {
    context.log(`Eventhub trigger function called for message array: ${IoTHubMessages}`);

    //Authorization (UsernamePasswordCredential for Local Development)
    //const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    const credentials = new UsernamePasswordCredential(tenantId, clientId, username, password);
    const client = new DigitalTwinsClient(adtInstanceUrl, credentials);

    for await (var reading of IoTHubMessages) {
        context.log(reading);
        //create all Patch Objects
        var patchObject = createPatchObject('/temperature', reading.temperature);

        //make request with patchObjects
        await client.updateDigitalTwin('Besprechungsraum',  [patchObject])
    }

};



export default IoTHubTrigger; 
5