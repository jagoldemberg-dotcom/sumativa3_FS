# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependencias primero para aprovechar cache
COPY package*.json ./
RUN npm ci

# Copia el código y compila en modo producción
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/tiendaderatas-angular/browser/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]