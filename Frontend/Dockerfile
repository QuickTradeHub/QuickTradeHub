# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Set up Nginx with SSL
FROM nginx:alpine

RUN apk add --no-cache certbot bash

# Copy the built React app to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports 80 and 443
EXPOSE 80 443

# Mount SSL certificates (they will be generated and mounted from EC2)
VOLUME ["/etc/letsencrypt"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
