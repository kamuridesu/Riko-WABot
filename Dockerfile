ARG BASE_IMAGE=node:18-slim

FROM ${BASE_IMAGE} as base_git
RUN apt update && apt install git -y

FROM ${BASE_IMAGE} as runtime
RUN apt update && apt install ffmpeg libwebp-dev libopus-dev -y

FROM base_git as build
WORKDIR /app
COPY ./package.json .
RUN npm install --include=dev
COPY . .
RUN npm run build

FROM base_git as deps
WORKDIR /app
COPY ./package.json .
RUN npm i

FROM runtime
WORKDIR /app
COPY --from=deps /app/ .
COPY --from=build /app/modules /app/modules
COPY ./init.sh /app/init.sh
COPY migrations /app/migrations
COPY ./migrate.js /app/migrate.js
COPY ./*.json .
CMD [ "sh", "init.sh" ]
