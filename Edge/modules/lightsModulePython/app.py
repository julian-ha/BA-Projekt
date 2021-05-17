
import asyncio
from azure.iot.device.aio import IoTHubModuleClient
from azure.iot.device import Message
import RPi.GPIO as GPIO
import json
from os import environ

redPin = environ['pinNumberRed']
yellowPin = environ['pinNumberYellow']
greenPin = environ['pinNumberGreen']

GPIO.setmode(GPIO.BCM)
GPIO.setup(redPin, GPIO.OUT)
GPIO.setup(yellowPin, GPIO.OUT)
GPIO.setup(greenPin, GPIO.OUT)



async def main():
    module_client = IoTHubModuleClient.create_from_edge_environment()

    await module_client.connect()

    def setLights(co2, thresholdRed, thresholdYellow):
        print('Setting lights')
        print(co2)
        print(thresholdRed)
        print(thresholdYellow)

        if(co2 >= thresholdRed):
            print('Setting lights for red')
            GPIO.output(redPin, GPIO.HIGH)
            GPIO.output(yellowPin, GPIO.LOW)
            GPIO.output(greenPin, GPIO.LOW)
            return
        
        if co2 >= thresholdYellow:
            print('setting lights for yellow')
            GPIO.output(redPin, GPIO.LOW)
            GPIO.output(yellowPin, GPIO.HIGH)
            GPIO.output(greenPin, GPIO.LOW)
            return
        
        print('setting lights for green')
        GPIO.output(redPin, GPIO.LOW)
        GPIO.output(yellowPin, GPIO.LOW)
        GPIO.output(greenPin, GPIO.HIGH)
            


    def message_handler(message):
        if message.input_name == 'generatedMessage':
            print('Message received on generatedMessage Input')
            msg = json.loads(message.data)
            if msg.co2Value and msg.thresholdRed and msg.thresholdYellow:
                setLights(int(msg.co2Value), int(msg.thresholdRed), int(msg.thresholdYellow))
        else:
            print('Message received on unknown input')
    
    module_client.on_message_received = message_handler
    
    
    # define behavior for halting the application
    def stdin_listener():
        while True:
            selection = input("Press Q to quit\n")
            if selection == "Q" or selection == "q":
                print("Quitting...")
                break

    # Run the stdin listener in the event loop
    loop = asyncio.get_running_loop()
    user_finished = loop.run_in_executor(None, stdin_listener)

    # Wait for user to indicate they are done listening for messages
    await user_finished

    # Finally, shut down the client
    await module_client.shutdown()



if __name__ == "__main__":
    asyncio.run(main())