#!/bin/bash

# Talaseen Quick Start Script

echo "🚀 Starting Talaseen project..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run ./setup.sh first!"
    exit 1
fi

# Start PostgreSQL first
echo "📊 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations
echo "🔄 Running database migrations..."
cd services/backend
npx prisma migrate dev --name init
npx prisma generate
cd ../..

# Start all services
echo "🚀 Starting all services..."
docker-compose up --build

echo "✅ All services started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:4000"
echo "Vendor Panel: http://localhost:5173"
