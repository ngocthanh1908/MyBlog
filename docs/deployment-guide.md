# Deployment Guide

## Infrastructure

| Item | Value |
|---|---|
| VPS IP | `103.98.160.56` |
| SSH User | `root` (key-based auth) |
| App Location | `/opt/myblog` |
| App Port | `8001` (Nginx → Next.js:3000) |
| Containers | `myblog-app` (Next.js), `myblog-nginx` (reverse proxy) |
| SSH Key (PPK) | `AThanh.ppk` — convert to OpenSSH for CLI/GitHub Actions |

## Architecture

```
Internet → [:8001] Nginx (reverse proxy) → [:3000] Next.js (standalone)
                         ↑
              docker-compose.prod.yml
              Location: /opt/myblog
```

## Prerequisites (VPS)

```bash
# Docker & Docker Compose
apt-get update && apt-get install -y docker.io docker-compose-v2 git
```

## First-Time Deploy

```bash
# SSH into VPS
ssh -i ~/.ssh/vps_key root@103.98.160.56

# Clone and deploy
mkdir -p /opt/myblog
cd /opt/myblog
git clone https://github.com/ngocthanh1908/MyBlog.git .
bash scripts/deploy.sh
```

## Manual Redeploy

```bash
ssh -i ~/.ssh/vps_key root@103.98.160.56
cd /opt/myblog
git pull origin master
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

## Auto-Deploy (GitHub Actions)

Push to `master` triggers CI → deploy automatically.

**Required GitHub Secrets** (Settings → Secrets → Actions):

| Secret | Value |
|---|---|
| `VPS_HOST` | `103.98.160.56` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | OpenSSH private key (convert PPK via PuTTYgen → Conversions → Export OpenSSH key) |

## Managing the App on VPS

All commands run from `/opt/myblog` on the VPS.

### View Status

```bash
docker compose -f docker-compose.prod.yml ps
```

### View Logs

```bash
# All containers
docker compose -f docker-compose.prod.yml logs -f

# App only
docker compose -f docker-compose.prod.yml logs -f app

# Nginx only
docker compose -f docker-compose.prod.yml logs -f nginx

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail 100 app
```

### Stop App

```bash
docker compose -f docker-compose.prod.yml down
```

### Restart App

```bash
docker compose -f docker-compose.prod.yml restart
```

### Rebuild & Restart (after code changes)

```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Enter Container Shell

```bash
# App container
docker exec -it myblog-app sh

# Nginx container
docker exec -it myblog-nginx sh
```

### Cleanup Disk Space

```bash
# Remove unused images
docker image prune -f

# Remove all unused data (images, containers, networks)
docker system prune -f
```

### Check Resource Usage

```bash
docker stats --no-stream
```

## Environment Variables

Edit `docker-compose.prod.yml` to change env vars:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # Update when domain is ready
```

After changing, rebuild: `docker compose -f docker-compose.prod.yml up -d --build`

## Cloudflare Setup

1. Add A record: `yourdomain.com` → `103.98.160.56`
2. SSL mode: **Full** (if adding SSL to Nginx) or **Flexible** (current HTTP setup)
3. Under Cloudflare proxy settings, set origin port to `8001`
4. Update `NEXT_PUBLIC_SITE_URL` in `docker-compose.prod.yml` to your domain

## Troubleshooting

| Issue | Command |
|---|---|
| App not responding | `docker compose -f docker-compose.prod.yml logs -f app` |
| Nginx 502 Bad Gateway | `docker compose -f docker-compose.prod.yml restart app` |
| Disk full | `docker system prune -f` |
| Port conflict | `ss -tlnp \| grep 8001` |
| Container won't start | `docker compose -f docker-compose.prod.yml logs app` |
| Rebuild from scratch | `docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml build --no-cache && docker compose -f docker-compose.prod.yml up -d` |

## Key Files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: install deps → build → standalone runner |
| `docker-compose.prod.yml` | Production containers (app + nginx) |
| `nginx/default.conf` | Reverse proxy, gzip, caching, Cloudflare real IP |
| `scripts/deploy.sh` | One-command deploy script (run on VPS) |
| `.github/workflows/deploy.yml` | Auto-deploy on push to master |
