FROM node:alpine
WORKDIR "/app"
COPY ./package*.json ./
RUN npm install
COPY . .
CMD ["sh", "start-script.sh"]