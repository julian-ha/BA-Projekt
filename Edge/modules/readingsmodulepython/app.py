
import asyncio
import time
from azure.iot.device.aio import IoTHubModuleClient
from azure.iot.device import Message, MethodResponse
import ambimateClass
import datetime
from os import environ
import json
import requests
deviceId = environ["IOTEDGE_DEVICEID"]

ambimate = ambimateClass.ambimate()

def retrieveTwinData():
    url = "https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/Abstellraum?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg=="

    payload={}
    headers = {}
    try:
        response = requests.request("GET", url, headers=headers, data=payload)
        response_data = json.loads(response.text)
        environ["co2ThresholdRed"] = str(response_data[0]["co2ThresholdRed"])
        environ["co2ThresholdYellow"] = str(response_data[0]["co2ThresholdYellow"])
    except Exception as e:
       print('error retrieving data from digital Twins')
       print(e)



#FUnktion set Lights
def setLights(module_client, co2Value, thresholdRed, thresholdYellow):
    msg = Message(json.dumps({
        "co2": int(co2Value),
        "thresholdRed": int(thresholdRed),
        "thresholdYellow": int(thresholdYellow)
    }))

    module_client.send_message_to_output(msg, "thresholdData")
    print('send Message to lightsModule')


async def main():

    module_client = IoTHubModuleClient.create_from_edge_environment()

    await module_client.connect()
    
    async def methodListener(method_request):
        try:
            print('direct method')
            print(method_request.payload)
            payload = json.loads(method_request.payload)

            if int(payload["thresholdYellow"]) >= int(payload["thresholdRed"]):
                method_response = MethodResponse.create_from_method_request(method_request, 400, None)
                await module_client.send_method_response(method_response)
                return

            method_response = MethodResponse.create_from_method_request(method_request, 200, payload='method success')
            await module_client.send_method_response(method_response)
        except Exception as e:
            print('fehler')
            print(e)

    module_client.on_method_request_received = methodListener
    while True:
        if int(environ["co2ThresholdYellow"]) == -1 or int(environ["co2ThresholdRed"]) == -1:
            print("trying to get data from Digital Twins")
            retrieveTwinData()
        print('generating Message')
        try:
            reading = ambimate.read_all()
            global data
            data = {
                "timestamp": str(datetime.datetime.now()),
                "deviceId": deviceId,
                "deviceType": "room",
                "temperature": reading.temperature,
                "humidity": reading.humidity,
                "co2hresholdRed": int(environ['co2ThresholdRed']),
                "co2ThresholdYellow": int(environ['co2ThresholdYellow']),
                "co2": reading.co2,
                "voc": reading.voc,
                "light": reading.light,
                "loudness": reading.audio
            }
            print(data["co2"])

            msg = Message(json.dumps(data))
            setLights(module_client, data["co2"], environ['co2ThresholdRed'], environ['co2ThresholdYellow'])
            await module_client.send_message_to_output (msg, "cloudMessage")
            print('sent Message upstream')

        except IOError:
            print('IO Error')
        except Exception as e:
            print('error')
            print(e)
            raise
        time.sleep(60)



if __name__ == '__main__':
    asyncio.run(main())