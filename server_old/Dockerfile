FROM node:10

EXPOSE 3001

ARG NODE_ENV
ENV API_NAME $API_NAME
ENV API_PORT $API_PORT
ENV DB_PORT $DB_PORT
ENV DB_ADDRESS $DB_ADDRESS
ENV DB_NAME $DB_NAME
ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV ENABLE_SEND_SMS $ENABLE_SEND_SMS

RUN mkdir /app
ADD package*.json /app/

ADD . /app

RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm config set python /usr/bin/python

WORKDIR /app

RUN npm install

RUN npm rebuild bcrypt --build-from-source
RUN npm run build

RUN apk del builds-deps

CMD ["npm", "start"]
