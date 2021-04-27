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
                        //var data = await bme680.getSensorData();
                        var data = {
                            timestamp: new Date(),
                            deviceId: 'Besprechungsraum',
                            temperature: Math.floor(Math.random() * 50),
                            humidity: Math.floor(Math.random() * 100),
                            co2ThresholdRed: 1000,
                            co2ThresholdYellow: 800,
                            co2: Math.floor(Math.random() * 1000),
                            voc: Math.floor(Math.random() * 1000),
                            light: Math.floor(Math.random() * 1000),
                            loudness: Math.floor(Math.random() * 150),
                        }
                    } catch (e) {
                        var data = `${e}`;
                    }
                    var msg = new Message(JSON.stringify(data));
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