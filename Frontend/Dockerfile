# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

# Stage 2: Set up Nginx with SSL
FROM nginx:alpine


RUN apk add --no-cache certbot certbot-nginx bash

# Copy the built React app to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose ports 80 (HTTP) and 443 (HTTPS)
EXPOSE 80 443

# If you already have SSL certificates, mount the /etc/letsencrypt directory
VOLUME ["/etc/letsencrypt"]

# Start Nginx with SSL
CMD ["nginx", "-g", "daemon off;"]
