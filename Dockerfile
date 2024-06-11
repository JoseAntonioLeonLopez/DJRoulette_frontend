# Usamos una imagen de Node.js como base
FROM node:latest as build

# Establecemos el directorio de trabajo en /app
WORKDIR /app

# Copiamos el archivo package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Construimos la aplicación Angular
RUN npm run build

# Segunda etapa del Dockerfile para servir la aplicación Angular

# Usamos una imagen de servidor web ligero, por ejemplo, http-server
FROM node:latest as serve

# Instalamos http-server de forma global
RUN npm install -g http-server

# Establecemos el directorio de trabajo en /app/dist
WORKDIR /app/dist

# Copiamos los archivos construidos de la etapa anterior
COPY --from=build /app/dist .

# Exponemos el puerto 80 (puedes cambiarlo si es necesario)
EXPOSE 80

# Comando para iniciar http-server y servir la aplicación Angular
CMD ["http-server", "-c-1"]
