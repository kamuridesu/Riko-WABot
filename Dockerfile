FROM node:16 as build
RUN apt install git
WORKDIR /app
COPY ./package.json .
RUN npm install --include=dev
COPY . .
RUN npm run build

FROM node:18-alpine as deps
WORKDIR /app
RUN apk add git
COPY ./package.json .
RUN npm i

FROM node:18-alpine
WORKDIR /app
RUN apk add ffmpeg libwebp-tools
COPY --from=deps /app/ .
COPY --from=build /app/modules /app/modules
CMD [ "npx", "whatframework" ]
