FROM node:12.16.1-alpine3.9

WORKDIR /usr/app

COPY ./package*.json /usr/app/

RUN npm install --production && npm cache clean --force

# Add source code
COPY src /usr/app/src

EXPOSE 3456 3456
CMD [ "node", "src/server.js" ]