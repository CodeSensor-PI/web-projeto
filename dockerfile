FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build


FROM nginx:alpine

RUN apk add --no-cache gettext

RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY env.js /usr/share/nginx/html/env.js

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD /bin/sh -c "envsubst '\$SERVER_ID' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/server.conf && \
               nginx -g 'daemon off;'"
