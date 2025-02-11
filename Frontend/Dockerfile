# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

# Stage 2: Set up Nginx with SSL
FROM nginx:alpine

# Install Certbot for Let's Encrypt SSL certificate
RUN apk add --no-cache certbot certbot-nginx bash

# Copy the built React app to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose ports 80 (HTTP) and 443 (HTTPS)
EXPOSE 80 443

# Obtain and renew SSL certificates
CMD ["/bin/sh", "-c", "\
    certbot --nginx --non-interactive --agree-tos --email ak4902196@gmail.com -d quicktradehub.in && \
    nginx -g 'daemon off;'"]
