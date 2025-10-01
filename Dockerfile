# Multi-stage Docker build for secure, isolated migration
FROM node:18-alpine AS base

# Stage 1: Build CLI
FROM base AS cli-builder
WORKDIR /app/cli
COPY package*.json ./
RUN npm ci --only=production
COPY index.js ./
COPY lib ./lib

# Stage 2: Build Web UI
FROM base AS web-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Stage 3: Final isolated runtime
FROM node:18-alpine AS runtime

# Security: Run as non-root user
RUN addgroup -g 1001 -S migrator && \
    adduser -S migrator -u 1001

WORKDIR /migration

# Copy CLI tools
COPY --from=cli-builder --chown=migrator:migrator /app/cli ./cli

# Copy web build (static files only - no server needed!)
COPY --from=web-builder --chown=migrator:migrator /app/web/dist ./web/dist

# Install minimal static file server
RUN npm install -g serve@14.2.1

# Switch to non-root user
USER migrator

# Expose port for web UI
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Default command: serve the static web UI
# All processing happens client-side in the browser!
CMD ["serve", "-s", "web/dist", "-l", "3000"]
