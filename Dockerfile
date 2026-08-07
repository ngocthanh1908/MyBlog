# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Build deps for better-sqlite3 native addon
RUN apk add --no-cache python3 make g++

ARG NEXT_PUBLIC_SITE_URL=https://blog.phamngocthanh.io.vn
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Create data dir for SQLite + uploads
RUN mkdir -p data public/uploads

# Build Next.js + Pagefind index
RUN npx next build
RUN npx pagefind --site .next/standalone --output-path .next/standalone/public/pagefind || true

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create persistent dirs owned by nextjs user
RUN mkdir -p data public/uploads && chown -R nextjs:nodejs data public/uploads

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
