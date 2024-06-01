FROM node:20.14.0-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $SERVER_PORT

CMD ["npm", "run", "start:prod"]
