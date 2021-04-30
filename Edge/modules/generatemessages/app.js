'use strict';

const Transport = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').ModuleClient;
const Message = require('azure-iot-device').Message;
const DeviceMethodResponse = require('azure-iot-device').DeviceMethodResponse;

const ambimateClass = require('./ambimate');

const axios = require('axios');

const bme = require('bme680-sensor');


const twinFunctionUrl = "https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/Besprechungsraum?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==";
var co2ThresholdRed = 9999;
var co2ThresholdYellow = 9999;

var ambimate = new ambimateClass(0x2a, 1);

const delay = async(ms) => {
    new Promise(resolve => setTimeout(resolve, ms))
}

const retrieveTwinData = async (twinId) => {
    var config = {
        method: 'get',
        url: `https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/${twinId}?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==`,
        headers: { }
      };
      
      axios(config)
      .then(function (response) {
          var twin = response.data[0];
          co2ThresholdRed = parseInt(twin.co2ThresholdRed);
          co2ThresholdYellow = parseInt(twin.co2ThresholdYellow);
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log('Error retrievieng Data from twin');
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
            co2ThresholdYellow = parseInt(data.thresholdYellow);
            co2ThresholdRed = parseInt(data.thresholdRed);
            if (co2ThresholdYellow >= co2ThresholdRed) {
                res.send(400, 'The Thresholdvalue for the red light has to be higher than the one for the yellow light.');
                return
            } 

            res.send(200, 'method success');
        });

        client.open(async (err) => {
            if (err) {
                throw err;
            } else {
                console.log('Module initialized.');
                setInterval(async() => {
                    try {

                        if(co2ThresholdYellow == 9999) {
                            console.log('trying to get data from Digitaltwins');
                            await retrieveTwinData('Besprechungsraum');
                        }
                        var reading = await ambimate.readAll().then((reading) => {
                            console.log(reading);

                            var data = {
                                timestamp: new Date(),
                                deviceId: 'Besprechungsraum',
                                temperature: reading.temperature,
                                humidity: reading.humidity,
                                co2ThresholdRed: co2ThresholdRed,
                                co2ThresholdYellow: co2ThresholdYellow,
                                co2: reading.co2,
                                voc: reading.voc,
                                light: reading.light,
                                loudness: reading.audio
                            }
                            var msg = new Message(JSON.stringify(data));
                            client.sendOutputEvent('generatedMessage', msg, (err, res) => {
                                if (err) {
                                    console.log(err);
                                    return 
                                }
                            });
                        }).catch(err => {
                            console.log(err);
                        });




                    } catch (err) {
                        throw err;
                    }

                }, 60000)

            }
        });
    }
});