# --- Build stage ---
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:20-slim
WORKDIR /app

# Instala servidor estático leve
RUN npm install -g serve

# Copia o build gerado
COPY --from=build /app/dist ./dist

# Copia env.js default (será override na EC2)
COPY env.js ./dist/env.js

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
