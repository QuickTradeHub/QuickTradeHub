# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./ 

RUN npm install

COPY . ./ 

RUN npm run build

# Stage 2: Set up Nginx with SSL
FROM nginx:alpine

# Install Certbot and Nginx
RUN apk add --no-cache certbot certbot-nginx bash

# Copy the built React app to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose ports 80 (HTTP) and 443 (HTTPS)
EXPOSE 80 443

# Create directories for SSL certificates
RUN mkdir -p /etc/letsencrypt/live/quicktradehub.in

# Run Certbot to generate SSL certificates (non-interactive)
RUN certbot certonly --standalone --agree-tos --no-eff-email --email ak4902196@gmail.com -d quicktradehub.in -d www.quicktradehub.in

# Run Nginx with SSL
CMD ["nginx", "-g", "daemon off;"]
