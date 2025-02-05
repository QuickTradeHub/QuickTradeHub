# Use official Node.js image to build the React app
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx for serving the built React app
FROM nginx:alpine

# Copy built files to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf


# Expose port 80 to serve the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
