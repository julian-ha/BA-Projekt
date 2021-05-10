'use strict';

const Transport = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').ModuleClient;
const Message = require('azure-iot-device').Message;
const ambimateClass = require('./ambimate');

const axios = require('axios');

const twinName = process.env.IOTEDGE_DEVICEID;
global.data;


var ambimate = new ambimateClass(0x2a, 1);


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



const retrieveTwinData = async (client, twinId) => {
    return new Promise((resolve, reject) => {
    var config = {
        method: 'get',
        url: `https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/${twinId}?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==`,
        headers: { }
      };
      

          axios(config)
            .then(response => {
                var twin = response.data[0];
                process.env['co2ThresholdRed'] = +twin.co2ThresholdRed;
                process.env['co2ThresholdYellow'] = +twin.co2ThresholdYellow;
                console.log('retrieved data from Digital Twins');
                resolve();
            })
            .catch(err => {
                console.log('Error retrieving data from Digital Twins');
                reject(err);
            })
});
}

const setLights = (client, co2Value, thresholdRed, thresholdYellow) => {
    var msg = new Message ( JSON.stringify({
        co2: +co2Value,
        thresholdRed: +thresholdRed,
        thresholdYellow: +thresholdYellow
    }));

    client.sendOutputEvent('thresholdData', msg, printResultFor('Sending message to lightsModule'));
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
            if (data.thresholdYellow >= data.thresholdRed) {
                res.send(400, 'The Thresholdvalue for the red light has to be higher than the one for the yellow light.');
                return
            } 
            process.env['co2ThresholdYellow'] = +data.thresholdYellow;
            process.env['co2ThresholdRed'] = +data.thresholdRed;
            setLights(client, global.data.co2, process.env.co2ThresholdRed, process.env.co2ThresholdYellow);

            res.send(200, 'method success');
        });

        client.open(async (err) => {
            if (err) {
                throw err;
            } else {
                console.log('Module initialized.');
                setInterval(async() => {
                    try {

                        if(process.env.co2ThresholdRed == -1 || process.env.co2ThresholdYellow == -1) {
                            console.log('trying to get data from Digitaltwins');
                            await retrieveTwinData(client, twinName);
                        }
                        var reading = await ambimate.readAll();
                        
                            console.log(reading);

                            global.data = {
                                timestamp: new Date(),
                                deviceId: twinName,
                                temperature: reading.temperature,
                                humidity: reading.humidity,
                                co2ThresholdRed: +process.env.co2ThresholdRed,
                                co2ThresholdYellow: +process.env.co2ThresholdYellow,
                                co2: reading.co2,
                                voc: reading.voc,
                                light: reading.light,
                                loudness: reading.audio
                            }
                            var msg = new Message(JSON.stringify(data));
                            setLights(client, data.co2, process.env.co2ThresholdRed, process.env.co2ThresholdYellow);
                            client.sendOutputEvent('cloudMessage', msg, printResultFor('Sending message upstream'));
                            

                    } catch (err) {
                        throw err;
                    }

                }, 60000)

            }
        });
    }
});