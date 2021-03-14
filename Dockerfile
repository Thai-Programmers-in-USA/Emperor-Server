FROM node:15-alpine3.13

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -D nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]