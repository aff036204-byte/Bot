FROM node:18-bullseye-slim

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY bot.js ./
CMD ["node", "bot.js"]
