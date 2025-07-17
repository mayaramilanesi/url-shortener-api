FROM node:24-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
