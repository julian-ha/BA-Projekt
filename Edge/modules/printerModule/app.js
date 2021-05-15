'use-strict';

const Transport = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').ModuleClient;
const Message = require('azure-iot-device').Message;
const Bme680 = require('bme680-sensor').Bme680;

const deviceId = process.env.IOTEDGE_DEVICEID;

var bme680  = new Bme680(1, 0x76);

bme680.initialize().then(() => {
    console.log('Sensor initialized');
});



// Helper function to print results in the console
const printResultFor = (op) => {
    return (err, res) => {
      if (err) {
        console.log(op + ' error: ' + err.toString());
      }
      if (res) {
        console.log(op + ' status: ' + res.constructor.name);
      }
    };
  }


Client.fromEnvironment(Transport, (err, client) => {
    if(err) throw err;

    client.on('err', (err) => {
        throw err;
    });

    client.open((err) => {
        if (err) throw err;

        console.log('IoT Hub module client initialized');

        setInterval(async () => {
            var reading = await bme680.getSensorData();
            console.log(reading.data);
            var data = {
                deviceId: deviceId,
                timestamp: new Date(),
                temperature: reading.data.temperature
            }
            var msg = new Message(JSON.stringify(data));
            client.sendOutputEvent('cloudMessage', msg, printResultFor('Sending message upstream'));
        }, 60000);

    });
});
