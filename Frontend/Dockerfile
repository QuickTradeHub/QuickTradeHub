# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

# Stage 2: Set up Nginx with Certbot and SSL certificate generation
FROM nginx:alpine

# Install Certbot and necessary dependencies
RUN apk add --no-cache certbot certbot-nginx bash

# Copy the built React app to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose ports 80 (HTTP) and 443 (HTTPS)
EXPOSE 80 443

# Set environment variable for domain
ENV DOMAIN=quicktradehub.in

# Run Certbot to generate SSL certificates
ENTRYPOINT ["sh", "-c", "certbot certonly --standalone --preferred-challenges http -d $DOMAIN && nginx -g 'daemon off;'"]
