

FROM arm64v8/node:10

WORKDIR /app/

COPY package*.json ./
RUN  apt-get update -y

RUN  apt-get install -y python

RUN  apt-get install build-essential -y

RUN npm install --production

COPY app.js ./
COPY ambimate.js ./

CMD ["node", "app.js"]
