FROM node:22.12.0-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE $SERVER_PORT

CMD ["npm", "run", "start:prod"]
