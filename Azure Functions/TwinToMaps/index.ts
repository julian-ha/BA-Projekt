import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { AzureFunction, Context } from "@azure/functions"
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";

const digitalTwinsUrl: string = process.env.digitalTwinsUrl;
const adtInstanceUrl: string = process.env.adtInstanceUrl;


const queryTwin = async (digitalTwinsClient: DigitalTwinsClient, query: string) => {
    var result = [];
    for await (var twin of digitalTwinsClient.queryTwins(query)) {
        result.push(twin);
    }
    return result
}

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    // context.log(typeof eventGridEvent);
    // context.log(eventGridEvent);

    //Authorization (DefaultAzureCredential for local Development)
    //const credentials = new DefaultAzureCredential();
    const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    const digitalTwinsClient = new DigitalTwinsClient(adtInstanceUrl, credentials);
    //context.log(eventGridEvent.subject);
    for  (var patchObject of eventGridEvent.data.data.patch) {
        context.log(patchObject);
        var isUpdateble = false;


        //Stateset Ids noch platzieren
        switch(patchObject.path) {
            case '/temperature':
                isUpdateble = true;
                break;
            case '/humidity':
                isUpdateble = true;
                break;
            default:
                isUpdateble = false;   
        }

        if(isUpdateble) {
            //make request to Endpoint
            
        }



    } 
    const query = `SELECT * FROM digitaltwins WHERE $dtId = '${eventGridEvent.subject}'`;
    var queryResult = await queryTwin(digitalTwinsClient, query);
    //context.log(queryResult);

};

export default eventGridTrigger;
