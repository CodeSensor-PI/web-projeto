FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# --- Stage para servir os arquivos staticos ---
FROM node:20-slim

WORKDIR /app

# Instala servidor estático leve
RUN npm install -g serve

# Copia o build
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
