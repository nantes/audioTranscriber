# Usa una imagen base de Node.js 20
FROM node:20-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación de React
RUN npm run build

# Instala un servidor estático para servir la aplicación
RUN npm install -g serve

# Expone el puerto en el que la aplicación correrá
EXPOSE 8080

# Define el comando para iniciar el servidor estático
CMD ["serve", "-s", "build", "-l", "8080"]
