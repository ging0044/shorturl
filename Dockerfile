FROM node:latest
WORKDIR /usr/src/url
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
CMD ["npm", "run", "build"]
