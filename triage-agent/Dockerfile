# Dockerfile for Triage.AI Agent
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY agent.yaml ./
COPY start.js ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Change ownership of the app directory to nodeuser
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Expose port (use environment variable for flexibility)
EXPOSE ${PORT:-3001}

# Health check with better configuration
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://0.0.0.0:${PORT:-3001}/health || exit 1

# Start the application
CMD ["npm", "start"]