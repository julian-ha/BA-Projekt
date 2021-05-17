FROM arm32v7/python:3.7-slim-buster

WORKDIR /app
#COPY requirements.txt ./
RUN pip install azure-iot-device
RUN pip install smbus2
COPY . .

CMD [ "python3", "-u", "./app.py" ]