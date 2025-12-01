# ---- Build Stage ----
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

# Copia o env.js (substitui o que está no build)
COPY env.js /usr/share/nginx/html/env.js

# (Opcional) Copiar config nginx custom:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
