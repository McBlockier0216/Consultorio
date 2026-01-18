# client/Dockerfile

# Usamos Node 20 para evitar el error de "EBADENGINE"
FROM node:20

WORKDIR /app

COPY package.json ./

# 1. Usamos --ignore-scripts para que NO intente correr "quasar prepare" todavía
# (porque fallaría al no tener los archivos del proyecto copiados aún)
RUN npm install --legacy-peer-deps --ignore-scripts

# 2. Instalamos la herramienta de línea de comandos de Quasar
RUN npm install -g @quasar/cli

# 3. AHORA copiamos el resto de los archivos (incluyendo quasar.config.js)
COPY . .

# 4. Y finalmente ejecutamos el prepare manualmente, ahora que ya existen los archivos
RUN npx quasar prepare

EXPOSE 9000

CMD ["npx", "quasar", "dev", "--host", "0.0.0.0"]