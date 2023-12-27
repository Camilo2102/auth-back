FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

EXPOSE 3000

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:migrate:prod" ]