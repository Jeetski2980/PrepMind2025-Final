# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifests first for better caching
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/

# Install deps (root, client, server)
RUN npm ci && npm --prefix client ci && npm --prefix server ci

# Copy source and build SPA + server bundle (your root build should do both)
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only prod deps for runtime
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts
COPY --from=build /app/dist ./dist

# Cloud Run sets $PORT; your server must use process.env.PORT
EXPOSE 8080
CMD ["node", "dist/server/node-build.mjs"]
