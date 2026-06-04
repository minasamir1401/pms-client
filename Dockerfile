# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Set environment variables for build time (Next.js needs this to embed the API URL)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Set production environment
ENV PORT=3000
ENV NODE_ENV=production

# Start Next.js server
CMD ["npm", "start"]
