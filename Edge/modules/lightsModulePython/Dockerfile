FROM arm32v7/python:3.7-slim-buster

WORKDIR /app
#COPY requirements.txt ./
RUN pip install azure-iot-device
CMD sudo apt-get install RPi.GPIO
COPY . .

CMD [ "python3", "-u", "./app.py" ]