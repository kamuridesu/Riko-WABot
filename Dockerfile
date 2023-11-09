FROM node:16 as build
RUN apt install git
WORKDIR /app
COPY . .
RUN npm install --include=dev
RUN npm run build

FROM node:18-alpine as deps
WORKDIR /app
RUN apk add git
COPY --from=build /app/package.json .
COPY --from=build /app/modules /app/modules
RUN npm i

FROM node:18-alpine
WORKDIR /app
RUN apk add ffmpeg libwebp-tools
COPY --from=deps /app/ .
CMD [ "npx", "whatframework" ]
