FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3000

COPY . .

RUN npm run build

ENV DB_URL mongodb://back_user:GRmAMbYUp9vygbApP1KQl4p6np@mongo:27017/userauth


CMD [ "node", "dist/main.js" ]