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

# Build the React app (Optional if not required)
RUN npm run build

# Use a smaller image to serve the app
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy only the necessary build files
COPY --from=build /app /app

# Expose port (adjust based on your app configuration)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
