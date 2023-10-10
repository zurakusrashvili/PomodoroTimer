FROM node:18

EXPOSE 3001

WORKDIR /src

# RUN npm install i npm@latest -g 

COPY package.json package-lock*.json ./

RUN npm install
RUN npm audit fix --force

COPY . .

CMD ["node", "index.js"]
