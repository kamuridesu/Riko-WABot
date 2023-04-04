FROM node:16
RUN apt install git
WORKDIR /app
COPY ./package.json .
RUN npm install

FROM node:16-alpine
WORKDIR /app
COPY --from=0 /app/ .
COPY --from=0 /app/package-lock.json .
COPY ./modules ./modules
CMD [ "npx", "whatframework" ]
