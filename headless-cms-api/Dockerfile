# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

# We also need any drizzle schema/migrations if they run from dist?
# Typically they might be needed for migrate.ts, but for the basic API, dist/main.js is enough.
COPY --from=builder /usr/src/app/drizzle ./drizzle

EXPOSE 4000

CMD ["node", "dist/main.js"]
