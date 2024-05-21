# Stage 1: Build stage
FROM node:22.1.0-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Compile TypeScript code
RUN npm run build

# Stage 2: Runtime stage
FROM node:22.1.0-alpine

ENV PORT="3000"
ENV MORGAN_LOG_TYPE="dev"
ENV DB_CONNECTION_STRING="mysql://user:pass@host:port/database"
ENV AMQP_CONNECTION_STRING="amqp://user:pass@host:port/vhost"
ENV QUEUE_ACCOUNT_CREATED_RETRIES="2"

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Remove npm cache to reduce image size
RUN npm cache clean --force

# Expose the port your app runs on
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -O /dev/null -o /dev/null http://localhost:${PORT}/healthy || exit 1

# Command to run your application
CMD ["npm", "start"]