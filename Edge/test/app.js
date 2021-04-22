const azureIoTHub = require('azure-iothub');

const connectionString = 'HostName=hubjulianha.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=QzyT3+yMIIusU9kQ5rY1Tg1fkYc/9b4heofjEZFrxM4=';

const client = azureIoTHub.Client.fromConnectionString(connectionString);
const registry = azureIoTHub.Registry.fromConnectionString(connectionString);

var device = new azureIoTHub.Device();
device.deviceId = 'testdevice';
registry.create(device, (err, res) => {
    console.log(res);
}) ;

const deviceId = 'edge';
const moduleId = 'generatemessages';


var i = 1;
setInterval(async () => {
    const payload = {
        test: 'test von Nodejs',
        number: i
    }
    const params = {
        methodName: 'testmethod',
        payload: JSON.stringify(payload)
    }
    await client.invokeDeviceMethod(deviceId, moduleId, params);
    console.log(`Messages sent: ${i}`);

    i++;
}, 10000);