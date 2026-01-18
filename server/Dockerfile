# server/Dockerfile

# Usamos Node 18
FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json e instalamos dependencias
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos el cliente de Prisma
RUN npx prisma generate

# Exponemos el puerto
EXPOSE 3000

# Comando para iniciar (Esperamos que la BD esté lista y corremos migraciones)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]