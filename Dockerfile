FROM node:18-slim as build
RUN apt update && apt install git -y
WORKDIR /app
COPY ./package.json .
RUN npm install --include=dev
COPY . .
RUN npm run build

FROM node:18-slim as deps
WORKDIR /app
RUN apt update && apt install git -y
COPY ./package.json .
RUN npm i

FROM node:18-slim as run
WORKDIR /app
RUN apt update && apt install ffmpeg libwebp-dev libopus-dev -y
COPY --from=deps /app/ .
COPY --from=build /app/modules /app/modules
COPY ./init.sh /app/init.sh
COPY migrations /app/migrations
COPY ./migrate.js /app/migrate.js
CMD [ "sh", "init.sh" ]
