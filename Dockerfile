# Choose a base image
FROM node:18-alpine

# Define the working directory in the container
WORKDIR /app

# Copy dependency files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Building the Angular application
RUN pnpm run build

# Expose the port on which the application will run
EXPOSE 3300

# Define command to start application
CMD ["pnpm", "start"]
