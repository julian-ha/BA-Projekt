'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
var DeviceMethodResponse = require('azure-iot-device').DeviceMethodResponse;

const axios = require('axios');

const bme = require('bme680-sensor');

const twinFunctionUrl = "https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/Besprechungsraum?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==";
var co2ThresholdRed = 9999;
var co2ThresholdYellow = 9999;

const bme680 = new bme.Bme680(1, 0x77);
bme680.initialize().then(async () => {
    console.info('Sensor initialized');
});

const retrieveTwinData = async (twinId) => {
    var config = {
        method: 'get',
        url: `https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/${twinId}?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==`,
        headers: { }
      };
      
      axios(config)
      .then(function (response) {
          var twin = response.data[0];
          co2ThresholdRed = twin.co2ThresholdRed;
          co2ThresholdYellow = twin.co2ThresholdYellow;
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
}


Client.fromEnvironment(Transport, (err,client) => {
    if (err) {
        throw err;
    } else {
        client.on('error', (err) => {
            throw err;
        });

        client.onMethod('co2lights', (req, res) => {

            var data = JSON.parse(req.payload);
            co2ThresholdYellow = data.thresholdYellow;
            co2ThresholdRed = data.thresholdRed

            res.send(200, 'method success');
        });

        client.open((err) => {
            if (err) {
                throw err;
            } else {
                console.log('Module initialized.');

                
                setInterval(async () => {
                    try {
                        //check variables from digitalTwin as restart
                        if(co2ThresholdYellow == 9999) {
                            console.log('trying to get data from Digitaltwins');
                            await retrieveTwinData('Besprechungsraum');
                        }
                        //var data = await bme680.getSensorData();
                        console.log(co2ThresholdRed);
                        var data = {
                            timestamp: new Date(),
                            deviceId: 'Besprechungsraum',
                            temperature: Math.floor(Math.random() * 50),
                            humidity: Math.floor(Math.random() * 100),
                            co2ThresholdRed: co2ThresholdRed,
                            co2ThresholdYellow: co2ThresholdYellow,
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