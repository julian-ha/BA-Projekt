var digitalTwins = require('@azure/digital-twins-core');
var identity = require('@azure/identity');


var credentials = new identity.DefaultAzureCredential();
var client = new digitalTwins.DigitalTwinsClient('https://twinju.api.weu.digitaltwins.azure.net', credentials);

const queryTwin = async (client, query) => {
    var result = await client.queryTwins(query);
    var twins = [];
    for await (var twin of result) {
        twins.push(twin);
    }
    return twins
} 


const run = async () => {

    const query ="SELECT T, CT FROM DIGITALTWINS T JOIN CT RELATED T.hasPrinters WHERE T.$dtId = 'Grossraum'";
    var twins = await queryTwin(client, query);
    //console.log(twins);
    var obj = twins[0].T;
    obj.printers = [];
    twins.forEach(element => {
        obj.printers.push(element.CT);
    });
    console.log(obj);
}
run(); 