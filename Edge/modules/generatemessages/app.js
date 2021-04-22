'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
var DeviceMethodResponse = require('azure-iot-device').DeviceMethodResponse;

const bme = require('bme680-sensor');


const bme680 = new bme.Bme680(1, 0x77);
bme680.initialize().then(async () => {
    console.info('Sensor initialized');
});


Client.fromEnvironment(Transport, (err,client) => {
    if (err) {
        throw err;
    } else {
        client.on('error', (err) => {
            throw err;
        });

        client.onMethod('testmethod', (req, res) => {
            console.log(req);

            res.send(200, 'das ist die Response');
        });

        client.open((err) => {
            if (err) {
                throw err;
            } else {
                console.log('Module initialized.');
                setInterval(async () => {
                    try {
                        var data = await bme680.getSensorData();
                    } catch (e) {
                        var data = `${e}`;
                    }
                    var msg = new Message(JSON.stringify(data.data));
                    client.sendOutputEvent('generatedMessage', msg, (err, res) => {
                        if (err) {
                            console.log(err);
                            return 
                        }
                    });
                }, 60000)
            }
        });
    }
});