#!/bin/bash
# Deploy MyBlog to VPS
# Run ON the VPS: bash deploy.sh

set -e

APP_DIR="/opt/myblog"
REPO_URL="https://github.com/ngocthanh1908/MyBlog.git"
BRANCH="master"

echo "=== MyBlog Deployment ==="

# Create app directory if not exists
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Clone or pull latest code
if [ -d ".git" ]; then
    echo "Pulling latest changes..."
    git fetch origin
    git reset --hard "origin/$BRANCH"
else
    echo "Cloning repository..."
    git clone -b "$BRANCH" "$REPO_URL" .
fi

# Build and start containers
echo "Building and starting containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Cleanup old images
echo "Cleaning up old images..."
docker image prune -f

echo "=== Deployment complete ==="
echo "App running at http://$(curl -s ifconfig.me):80"
docker compose -f docker-compose.prod.yml ps
