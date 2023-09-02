FROM node:lts-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

FROM nginx:stable-alpine AS server
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./deploy/nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080
