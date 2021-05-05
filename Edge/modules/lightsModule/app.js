'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
const gpio = require('rpi-gpio');


const redPin = process.env.pinNumberRed;
const yellowPin = process.env.pinNumberYellow ;
const greenPin = process.env.pinNumberGreen;
gpio.setup(redPin, gpio.DIR_OUT);
gpio.setup(yellowPin, gpio.DIR_OUT);
gpio.setup(greenPin, gpio.DIR_OUT);

const setLights = (co2Value, thresholdRed, thresholdYellow) => {
  // initialize the pins

    console.log('setting lights');
    console.log(`red: ${thresholdRed}`);
    console.log(`yellow: ${thresholdYellow}`);
    console.log(`co2: ${co2Value}`);
  
    if ( co2Value >= thresholdRed) {
      console.log('setting lights for red');
      gpio.write(redPin, true);
      gpio.write(yellowPin, false);
      gpio.write(greenPin, false);
      return
    }
  
    if (co2Value >= thresholdYellow) {
      console.log('setting lights for yellow');
      gpio.write(yellowPin, true);
      gpio.write(redPin, false);
      gpio.write(greenPin, false);
      return
    }
  
    //green
    console.log('setting lights for green');
    gpio.write(greenPin, true);
    gpio.write(yellowPin, false);
    gpio.write(redPin, false);


}




Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');

        client.on('inputMessage', function (inputName, msg) {
          pipeMessage(client, inputName, msg);
        });
      }
    });
  }
});

// This function just pipes the messages without any change.
function pipeMessage(client, inputName, msg) {
  client.complete(msg, printResultFor('Receiving message'));
  console.log(inputName);


  if (inputName === 'generatedMessage') {
    var message = msg.getBytes().toString('utf8');
    console.log(`thats the message: ${message}`);
    message = JSON.parse(message);
    var co2Value = message.co2;
    var thresholdRed = message.thresholdRed;
    var thresholdYellow = message.thresholdYellow;
    if (co2Value && thresholdRed && thresholdYellow) {
      setLights(co2Value, thresholdRed, thresholdYellow);
    }
  }
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    }
    if (res) {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}

