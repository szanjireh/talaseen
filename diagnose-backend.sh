#!/bin/bash

# Backend Connection Diagnostics Script

echo "🔍 Diagnosing Backend Connection Issue..."
echo ""

cd /opt/project/talaseen

# Check if containers are running
echo "📦 Checking running containers..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check backend container specifically
echo "🔍 Backend container status:"
docker ps -a --filter "name=talaseen-backend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check backend logs
echo "📋 Recent backend logs:"
docker logs --tail 50 talaseen-backend 2>&1 || echo "❌ Backend container not found or not running"
echo ""

# Check if backend is listening on port 4000
echo "🔌 Checking if backend is listening on port 4000..."
docker exec talaseen-backend netstat -tulpn 2>/dev/null | grep 4000 || echo "⚠️  Backend not listening on port 4000"
echo ""

# Check network connectivity
echo "🌐 Checking Docker network..."
docker network inspect talaseen-network 2>/dev/null | grep -A 5 "talaseen-backend" || echo "⚠️  Backend not in network"
echo ""

# Check if uploads directory exists in container
echo "📁 Checking uploads directory in container..."
docker exec talaseen-backend ls -lah /app/uploads/ 2>/dev/null || echo "❌ Cannot access uploads directory"
echo ""

echo "💡 Common fixes:"
echo "1. If backend is not running:"
echo "   docker-compose -f docker-compose.prod.yml restart backend"
echo ""
echo "2. If backend crashed, check logs and rebuild:"
echo "   docker-compose -f docker-compose.prod.yml up -d --build backend"
echo ""
echo "3. If uploads directory missing:"
echo "   docker exec talaseen-backend mkdir -p /app/uploads/products"
echo ""
