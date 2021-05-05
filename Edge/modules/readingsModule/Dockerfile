

FROM arm32v7/node:10

WORKDIR /app/

COPY package*.json ./


RUN npm install --production

COPY app.js ./
COPY ambimate.js ./

CMD ["node", "app.js"]
