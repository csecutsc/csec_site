FROM node:carbon
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install --production --quiet
COPY . /usr/src/app
EXPOSE 8081
CMD [ "npm", "start" ]