# Phase 7: Docker & Deployment

## Context Links
- [Dockerfile](../../Dockerfile)
- [docker-compose.prod.yml](../../docker-compose.prod.yml)
- [Nginx config](../../nginx/default.conf)
- [CI workflow](../../.github/workflows/ci.yml)
- [Deploy workflow](../../.github/workflows/deploy.yml)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 3h
- **Depends on**: Phase 1 (volume mounts), Phase 4 (pagefind in build)
- **Description**: Docker volume mounts for SQLite + uploads, Dockerfile updates for native deps, nginx static file serving

## File Ownership (this phase only)
```
MODIFY:
  Dockerfile                    — add build deps for better-sqlite3, pagefind postbuild
  docker-compose.prod.yml       — add volumes for data/ and public/uploads/
  nginx/default.conf            — add location block for /uploads/ static files
  .github/workflows/deploy.yml  — add env vars for JWT_SECRET, ADMIN_PASSWORD
  .github/workflows/ci.yml      — update if build step needs native deps
```

## Key Insights
- better-sqlite3 needs build tools (python3, make, g++) in Alpine during `npm ci`
- SQLite file must persist across container restarts → Docker volume
- Uploads directory must persist → Docker volume
- Nginx can serve /uploads/ directly (bypass Next.js for performance)
- Pagefind runs after next build → single RUN command
- Standalone output: need to copy data/ and pagefind output to runner stage

## Implementation Steps

### 1. Update Dockerfile (~15 lines changed)
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install build deps for better-sqlite3
RUN apk add --no-cache python3 make g++

ARG NEXT_PUBLIC_SITE_URL=https://blog.phamngocthanh.io.vn
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Create data dir for SQLite
RUN mkdir -p data public/uploads

# Build Next.js + Pagefind index
RUN npx next build
RUN npx pagefind --site .next/standalone --output-path .next/standalone/public/pagefind || true

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create persistent dirs owned by nextjs user
RUN mkdir -p data public/uploads && chown -R nextjs:nodejs data public/uploads

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. Update docker-compose.prod.yml
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: myblog-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_URL=https://blog.phamngocthanh.io.vn
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - blog-data:/app/data
      - blog-uploads:/app/public/uploads
    networks:
      - myblog-net

  nginx:
    image: nginx:alpine
    container_name: myblog-nginx
    restart: unless-stopped
    ports:
      - "8001:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - blog-uploads:/usr/share/nginx/uploads:ro
    depends_on:
      - app
    networks:
      - myblog-net

networks:
  myblog-net:
    driver: bridge

volumes:
  blog-data:
  blog-uploads:
```

### 3. Update nginx/default.conf (~10 lines added)
- Add location block to serve /uploads/ directly from volume:
  ```nginx
  # Serve uploaded images directly
  location /uploads/ {
      alias /usr/share/nginx/uploads/;
      expires 30d;
      add_header Cache-Control "public, max-age=2592000";
      try_files $uri =404;
  }
  ```
- Add upload size limit for proxy:
  ```nginx
  client_max_body_size 10M;
  ```

### 4. Update .github/workflows/deploy.yml
- Add secrets: `JWT_SECRET`, `ADMIN_PASSWORD`
- Pass as build args or write to .env on server
- Ensure `docker compose` uses env vars from server .env file

### 5. Create .env on VPS (manual step, documented)
```bash
# On VPS: create /opt/myblog/.env
JWT_SECRET=<generate: openssl rand -hex 32>
ADMIN_PASSWORD=<your-chosen-password>
```

### 6. Backup strategy (documented, not automated)
- SQLite backup: `docker cp myblog-app:/app/data/blog.sqlite ./backup/`
- Or cron job on VPS: daily copy of named volume
- Uploads backup: same approach, or rsync

## Todo List
- [ ] Update Dockerfile with build deps + data dirs
- [ ] Update docker-compose.prod.yml with volumes + env vars
- [ ] Update nginx config for /uploads/ and client_max_body_size
- [ ] Update deploy workflow for secrets
- [ ] Create .env.example with all required vars
- [ ] Test Docker build locally
- [ ] Test volume persistence (restart container, data survives)
- [ ] Document VPS setup steps

## Success Criteria
- `docker compose build` succeeds (better-sqlite3 compiles)
- `docker compose up` → app starts, serves pages
- Create post via admin → restart container → post still exists
- Upload image → accessible at /uploads/filename.jpg
- Nginx serves /uploads/ with cache headers
- No permission errors in container logs

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| better-sqlite3 build fails on Alpine | Medium | High | apk add python3 make g++ before npm ci |
| Volume permissions: nextjs user can't write | Medium | High | chown data/ and uploads/ dirs in Dockerfile |
| Pagefind --site path wrong for standalone | Medium | Medium | Test locally; add `|| true` to not break build |
| Named volumes vs bind mounts confusion | Low | Medium | Use named volumes for prod (Docker manages); document bind mount option |
