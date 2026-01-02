#!/bin/bash

echo "🚀 Starting Talaseen Services..."
echo ""

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Build and start
echo "🔨 Building and starting services..."
docker compose -f docker-compose.prod.yml up -d --build

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 5

# Show status
echo ""
echo "📊 Service Status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "📝 Nginx Logs:"
docker logs talaseen-nginx --tail 20

echo ""
echo "✅ Done! Check:"
echo "   - http://YOUR_IP"
echo "   - http://talaseen.com"
echo ""
echo "💡 View logs:"
echo "   docker logs talaseen-nginx -f"
echo "   docker logs talaseen-frontend -f"
echo "   docker logs talaseen-backend -f"
