FROM node:20.15.1-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $SERVER_PORT

CMD ["npm", "run", "start:prod"]
