# Usa una imagen oficial de Node.js como base
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm ci

# Copia el resto del código
COPY . .

# Expone el puerto (ajusta según tu app)
EXPOSE 3000

# Comando por defecto para correr la app
CMD ["npm", "start"]