# Step 1: Use Node.js as the base image
FROM node:18-alpine AS builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the application code
COPY . .

# Step 5: Build the application
RUN npm run build

# Step 6: Use an nginx image to serve the static files
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the default port for nginx
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
