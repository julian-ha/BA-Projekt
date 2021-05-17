from azure.iot.device.iothub.aio.async_clients import IoTHubDeviceClient
import requests
import json
import time


from azure.iot.device.aio import IoTHubDeviceClient
from azure.iot.device import MethodResponse, Message
import asyncio

conn = "HostName=hubiotju.azure-devices.net;DeviceId=testdevice;SharedAccessKey=n2xZ2KbyIz5XR/bIPpuiCj8Bdt7pPFdd5WQMsNTzpM4="
async def main():

    module_client = IoTHubDeviceClient.create_from_connection_string(conn)
    module_client.connect()

    data = "asdf"
    while True:
        msg = Message(data)
        await module_client.send_message(msg)
        time.sleep(10)



if __name__ == '__main__':
    asyncio.run(main())