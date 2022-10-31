FROM node:16

WORKDIR /src/main

# install app dependencies
COPY package*.json ./
RUN npm install

# bundle app source
COPY . .

CMD ["npm","start"]