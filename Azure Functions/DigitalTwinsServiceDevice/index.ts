import { ManagedIdentityCredential, DefaultAzureCredential } from '@azure/identity';
import { DigitalTwinsClient } from '@azure/digital-twins-core';
import { AzureFunction, Context, HttpRequest } from "@azure/functions"



const digitalTwinsUrl: string = process.env.digitalTwinsUrl;
const adtInstanceUrl: string = process.env.adtInstanceUrl;


const queryTwin = async (client: DigitalTwinsClient, query: string) => {
    var result = await client.queryTwins(query);
    var twins = [];
    for await (var twin of result) {
        twins.push(twin);
    }
    return twins
}
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    //const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    const credentials = new DefaultAzureCredential();
    const digitalTwinsClient = new DigitalTwinsClient(adtInstanceUrl, credentials);

    var query = "SELECT * FROM DIGITALTWINS";


    if (req.params.twinId) query = `SELECT * FROM DIGITALTWINS WHERE $dtId = '${ req.params.twinId }'`

    var result = await queryTwin(digitalTwinsClient, query);
    if (result.length == 0) {
        context.res = {
            status: 400,
            body: {
                errMessage: `Specified Twin not found`
            }
        }
        return;
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };


};

export default httpTrigger;