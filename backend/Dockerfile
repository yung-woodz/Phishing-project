FROM node:20

# Crear directorio de trabajo
WORKDIR /Phishing-project/backend

# Instalar Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependencias necesarias para Puppeteer
RUN apt-get update && apt-get install -y \
  libgconf-2-4 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libasound2 \
  libatspi2.0-0 \
  libfontconfig1 \
  libgtk-3-0 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libxcomposite1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxrandr2 \
  libxrender1 \
  libxtst6 \
  libjpeg-turbo-progs \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*


# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

RUN npm install axios

RUN npm install typeorm

# Copiar todo el proyecto
COPY . .

# Exponer el puerto del backend (ajústalo si es diferente)
EXPOSE 3000

# Instalar navegador de Puppeteer (Chrome) dentro del contenedor
RUN npx puppeteer browsers install chrome

RUN chmod +x wait-for-it.sh

CMD ["./wait-for-it.sh", "postgres:5432", "--", "npm", "run", "dev"]