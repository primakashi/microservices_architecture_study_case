FROM node:alpine

WORKDIR /app/

COPY package*.json .

RUN yarn install

COPY . .


ENV MONGO_URI=mongodb+srv://gibril:gibril@inventory-auth.7swikuf.mongodb.net/

ENV JWT_SECRET=UUURUDHHFGFFG6466bfhvwcft62q354

EXPOSE 5000

CMD [ "yarn", "dev" ]

