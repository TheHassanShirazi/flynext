FROM node:latest

WORKDIR /app

# Copy package files first to install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the app code
COPY . .

RUN npx prisma generate

# Run migrations for production
RUN npx prisma migrate deploy

# Expose the port
EXPOSE 3000

# Build and start the app in one CMD
CMD ["sh", "startup.sh"]