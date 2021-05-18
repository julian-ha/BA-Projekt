'use-strict';

const Transport = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').ModuleClient;
const Message = require('azure-iot-device').Message;

const deviceId = process.env.IOTEDGE_DEVICEID;





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
            var data = {
                deviceId: 'Drucker1',
                deviceType: 'printer',
                timestamp: new Date(),
                temperature: Math.floor(Math.random() * 40)
            }
            var msg = new Message(JSON.stringify(data));
            client.sendOutputEvent('cloudMessage', msg, printResultFor('Sending message upstream'));
        }, 60000);
    });
});
