FROM node:12.16.1-alpine3.9

WORKDIR /usr/app

COPY ./package*.json /usr/app/
COPY ./angular.json /usr/app/
COPY ./tsconfig.json /usr/app/
COPY ./tslint.json /usr/app/

# production
# RUN npm install --production && npm cache clean --force
# RUN npm run build

# dev
RUN npm install
RUN npm install -g @angular/cli

# Add source code
COPY src /usr/app/src

EXPOSE 4200 4200
CMD [ "npm", "start" ]
