FROM node:20

WORKDIR /Phishing-project/frontend

COPY package*.json ./

RUN npm install

COPY . .

# Compilar frontend
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
