FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# ─── Development ──────────────────────────────────────────────────────────────
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000 9229
CMD ["npm", "run", "dev"]

# ─── Production ───────────────────────────────────────────────────────────────
FROM base AS production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 3000
CMD ["node", "server.js"]
