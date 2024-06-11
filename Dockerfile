# Utiliza una imagen de Node como base
FROM node:20.10.0 AS builder

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todos los archivos de la aplicación al contenedor
COPY . .

# Compila la aplicación Angular para producción
RUN npm run build --prod

# Utiliza una imagen ligera de Nginx como base para servir la aplicación
FROM nginx:latest

# Copia los archivos de construcción de la aplicación Angular desde el constructor al directorio de trabajo de Nginx
COPY --from=builder /app/dist/* /usr/share/nginx/html/

# Exponer el puerto 80 para que Render.com pueda acceder a la aplicación
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
