FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE ${PORT}

CMD ["npm","run","dev"]
