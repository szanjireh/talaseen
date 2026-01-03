#!/bin/bash

# Fix uploads volume configuration for production
# This ensures images are persisted across container restarts

set -e

echo "🔧 Fixing uploads volume configuration..."

cd /opt/project/talaseen

# Backup current production images if they exist
if [ -d "services/backend/uploads" ]; then
    echo "📦 Backing up existing uploads..."
    BACKUP_DIR="uploads_backup_$(date +%Y%m%d_%H%M%S)"
    cp -r services/backend/uploads "$BACKUP_DIR"
    echo "✅ Backup created: $BACKUP_DIR"
fi

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p services/backend/uploads/products
chmod -R 755 services/backend/uploads

# Pull latest changes
echo "📥 Pulling latest configuration..."
git pull || echo "⚠️  Not a git repo or pull failed, continuing..."

# Rebuild and restart containers
echo "🔄 Rebuilding containers..."
docker-compose -f docker-compose.prod.yml down

echo "🚀 Starting containers with new volume configuration..."
docker-compose -f docker-compose.prod.yml up -d --build

# Restore backup if needed
if [ -d "$BACKUP_DIR" ] && [ -n "$BACKUP_DIR" ]; then
    echo "📥 Checking if backup restoration is needed..."
    
    # Copy images into the Docker volume
    CONTAINER_ID=$(docker ps -qf "name=talaseen-backend")
    if [ -n "$CONTAINER_ID" ]; then
        echo "📋 Copying backed up images into container volume..."
        docker cp "$BACKUP_DIR/products/." "$CONTAINER_ID:/app/uploads/products/" || echo "⚠️  No files to restore or copy failed"
        echo "✅ Images restored"
    fi
fi

# Verify volume is mounted
echo ""
echo "✅ Volume configuration updated!"
echo ""
echo "📊 Checking volume status..."
docker-compose -f docker-compose.prod.yml exec backend ls -lah /app/uploads/ || echo "Container still starting..."

echo ""
echo "🎉 Done! Your uploads are now persisted in a Docker volume."
echo "📍 Volume name: talaseen_backend_uploads"
echo ""
echo "To verify images are saved correctly, add a product and then run:"
echo "  docker volume inspect talaseen_backend_uploads"
