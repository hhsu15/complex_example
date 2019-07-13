# Multi build process for production
FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

# then copy this build and move to second phase
FROM nginx
EXPOSE 3000
# override the default.conf file. Recall this wiill have port 3000 rather than default 80
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build usr/share/nginx/html
