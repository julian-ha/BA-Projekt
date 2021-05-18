import { Query } from 'azure-iothub/dist/query';
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

const getRoomDatawithPrinters = (twins) => {
    var result = twins[0].T;
    result.printers = [];
    twins.forEach(element => {
        result.printers.push(element.CT);
    });
    return result
}


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const credentials = new ManagedIdentityCredential(digitalTwinsUrl);
    //const credentials = new DefaultAzureCredential();
    const digitalTwinsClient = new DigitalTwinsClient(adtInstanceUrl, credentials);

    const unitNameMaps = ((req.body && req.body.unitNameMaps) || req.query.unitNameMaps);
    if (!unitNameMaps) {
        context.res = {
            status: 400,
            body: {
                errMessage: `Specify a Unit Name`
            }
        }
        return;
    }

    var query = `SELECT * FROM DigitalTwins WHERE unitNameMaps = '${ unitNameMaps }'`;
    var resultTwins = await queryTwin(digitalTwinsClient, query);
    if (resultTwins.length == 0) {
        context.res = {
            status: 400,
            body: {
                errMessage: `Specified Unit Name not found.`
            }
        }
        return;
    }
    var result = resultTwins[0];

        //standard Request
        query = `SELECT T, CT FROM DIGITALTWINS T JOIN CT RELATED T.hasPrinters WHERE T.$dtId = '${result.$dtId}'`;
        context.log(query);
        var resultPrinters = await queryTwin(digitalTwinsClient, query);
        context.log(resultPrinters);
        if (resultPrinters.length != 0) {
            context.log('jetzt gehts hier rein');
            result = getRoomDatawithPrinters(resultPrinters);
        }
        context.log(result);
        if (result.length === 0) {
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
        body: result
    };

};

export default httpTrigger;

