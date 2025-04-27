FROM node:14

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]