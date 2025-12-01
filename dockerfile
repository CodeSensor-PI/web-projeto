
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build


FROM nginx:alpine

RUN apk add --no-cache gettext

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

# Copia o env.js para sobrescrever no container
COPY env.js /usr/share/nginx/html/env.js

# Copia o nginx.conf template que usa a variável $SERVER_ID
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Substitui a variável $SERVER_ID no default.conf → rendered.conf
# E inicia o Nginx usando o arquivo renderizado
CMD /bin/sh -c "envsubst '\$SERVER_ID' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/rendered.conf && \
               nginx -g 'daemon off;' -c /etc/nginx/conf.d/rendered.conf"
