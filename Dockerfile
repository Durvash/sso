# Use Node.js version 24
FROM node:24-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first (better for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and make 'node' the owner
COPY --chown=node:node . .

# Switch to the 'node' user for all following steps
USER node

# Start the application using your dev script
CMD ["npm", "run", "dev"]