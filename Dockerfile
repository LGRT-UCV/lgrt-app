# Establecer la imagen base
FROM node:20.15.0

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN yarn

# Copiar el resto de los archivos de la aplicación
COPY . .

# Corre ESLint y Prettier
RUN yarn fix:prettier

# Construir la aplicación Next.js
RUN yarn build

# Exponer el puerto que Next.js utilizará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start"]
