FROM node:lts-alpine

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

RUN cd /app/ && npm install bcrypt@3.0.5
RUN cd /app/ && npm install

WORKDIR /app

RUN npm run build

CMD ["npm", "start"]
