FROM node:22

WORKDIR /app

RUN mkdir -p /app/server /app/district-data

COPY ./server/package*.json /app/server/
WORKDIR /app/server
RUN npm install

COPY ./server /app/server
COPY ./district-data /app/district-data

EXPOSE 3000
CMD ["npm", "run", "start"]
