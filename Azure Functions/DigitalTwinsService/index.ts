import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";

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

    //const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    const credentials = new DefaultAzureCredential();
    const digitalTwinsClient = new DigitalTwinsClient(adtInstanceUrl, credentials);

    var query: string = 'SELECT * FROM DigitalTwins';

    const unitNameMaps = ((req.body && req.body.unitNameMaps) || req.query.unitNameMaps);
    if (unitNameMaps) query = `SELECT * FROM DigitalTwins WHERE unitNameMaps = '${unitNameMaps}'`;
    
    if (req.params.twinId) query = `SELECT * FROM DigitalTwins WHERE $dtId = '${req.params.twinId}'`;

    const withPrinters = ((req.body && req.body.withPrinters) || req.query.withPrinters);
    if (withPrinters) {
        if (!req.params.twinId) {
            context.res = {
                status: 404,
                body: {
                    errMessage: `Specified a twinId`
                }
            }
            return
        }
        query = `SELECT T, CT FROM DIGITALTWINS T JOIN CT RELATED T.hasPrinters WHERE T.$dtId = '${req.params.twinId}'`;
        var twins = await queryTwin(digitalTwinsClient, query);
        var result = twins[0].T;
        result.printers = [];
        twins.forEach(element => {
            result.printers.push(element.CT);
        });
        context.res = {
            status: 200,
            body: result
        }

        return
    }




    var twins = await queryTwin(digitalTwinsClient, query)
    if (twins.length === 0) {
        context.res = {
            status: 404,
            body: {
                errMessage: `Specified twin couldn't be found.`
            }
        }
        return;
    }
    
    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: twins
    };

};

export default httpTrigger;

