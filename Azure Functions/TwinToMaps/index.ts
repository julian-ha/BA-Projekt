import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { AzureFunction, Context } from "@azure/functions"
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import axios, { AxiosRequestConfig } from 'axios';

const digitalTwinsUrl: string = process.env.digitalTwinsUrl;
const adtInstanceUrl: string = process.env.adtInstanceUrl;

const azureMapsSubscriptionKey: string = process.env.azureMapsSubscriptionKey;
const statesetId: string = process.env.statesetId;


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

    const query = `SELECT * FROM digitaltwins WHERE $dtId = '${eventGridEvent.subject}'`;
    var queryResult = await queryTwin(digitalTwinsClient, query);
    context.log(queryResult);
    //context.log(eventGridEvent.subject);
    for  (var patchObject of eventGridEvent.data.data.patch) {
        var isUpdateble = false;


        //Stateset Ids noch platzieren
        var keyname;
        switch(patchObject.path) {
            case '/temperature':
                isUpdateble = true;
                keyname = "temperature";
                break;
            // case '/humidity':
            //     isUpdateble = true;
            //     break;
            default:
                isUpdateble = false;   
        }

        if(isUpdateble) {

            var data = {
                "states": [
                    {
                        "keyName": keyname,
                        "value": patchObject.value,
                        "eventTimestamp": eventGridEvent.eventTime
                    }
                ]
            }

            var endpoint = `https://us.atlas.microsoft.com/featureState/state?api-version=1.0&statesetID=${ statesetId }&featureID=${ queryResult[0].unitNameMaps }&subscription-key=${ azureMapsSubscriptionKey }`;

            var config: AxiosRequestConfig = {
                method: "post",
                url: endpoint,
                headers: { 
                    'Content-Type': 'application/json'
                  },
                data: JSON.stringify(data)
            }
            await axios(config)
                .then((response) => {
                    context.log('Maps Feature succesfully updated');
                })
                .catch((err) => {
                    context.log(`An error occured: ${err}`);
                    context.log(err);
                })
        }



    } 



};

export default eventGridTrigger;
