#FROM node:alpine AS build
FROM node:14 AS build

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install source-map
RUN npm install
COPY . .

# set OpenSSL legacy provider
# ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the application
RUN npm run build --omit=dev

FROM docker.io/nginx:alpine
COPY --from=build /usr/src/app/dist/MovieBase /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx-custom.config /etc/nginx/conf.d/default.conf

