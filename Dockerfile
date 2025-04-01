FROM node:latest

WORKDIR /app

# Copy package files first to install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port
EXPOSE 3000

# Build and start the app in one CMD
CMD ["sh", "startup.sh"]