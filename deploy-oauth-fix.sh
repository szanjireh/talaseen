#!/bin/bash

# Google OAuth Production Fix Deployment Script
# Usage: bash deploy-oauth-fix.sh

set -e

echo "======================================"
echo "Google OAuth Production Fix Deployment"
echo "======================================"
echo ""

# Check if we're in the project directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Backup existing .env if it exists
if [ -f ".env" ]; then
    echo "💾 Backing up existing .env to .env.backup.$(date +%Y%m%d-%H%M%S)"
    cp .env ".env.backup.$(date +%Y%m%d-%H%M%S)"
fi

echo ""
echo "📋 Current .env.production settings:"
echo "=========================================="
grep -E "GOOGLE_CALLBACK_URL|FRONTEND_URL|NEXT_PUBLIC_API_URL|NODE_ENV" .env.production
echo ""

echo "⚠️  IMPORTANT: Before proceeding, ensure these are set in your .env:"
echo "  1. POSTGRES_PASSWORD - Strong password"
echo "  2. JWT_SECRET - Run: openssl rand -base64 32"
echo "  3. JWT_REFRESH_SECRET - Run: openssl rand -base64 32"
echo ""

read -p "Have you configured the above secrets? (yes/no) " -n 3 -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "⚠️  Please update the secrets before proceeding"
    echo ""
    echo "Edit the .env file and set the following:"
    echo "  1. POSTGRES_PASSWORD: a strong password"
    echo "  2. JWT_SECRET: $(openssl rand -base64 32)"
    echo "  3. JWT_REFRESH_SECRET: $(openssl rand -base64 32)"
    exit 1
fi

echo ""
echo "🔄 Stopping old containers..."
docker-compose -f docker-compose.prod.yml down || true

echo ""
echo "🔨 Building images..."
docker-compose -f docker-compose.prod.yml build

echo ""
echo "🚀 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for containers to be ready (30 seconds)..."
sleep 30

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Verification Steps:"
echo "  1. Check backend is running: docker logs talaseen-backend | tail -20"
echo "  2. Check frontend is running: docker logs talaseen-frontend | tail -20"
echo "  3. Test Google OAuth at: https://talaseen.com/login"
echo ""
echo "🔗 Google Cloud Console Checklist:"
echo "  ❑ Add authorized redirect URI: https://talaseen.com/api/auth/google/callback"
echo "  ❑ Ensure Client ID: 556915763794-a7btd8o0cumlga9n8tadelthfh1qpvba.apps.googleusercontent.com"
echo "  ❑ Ensure Client Secret is correct"
echo ""
echo "📌 If you see 'Redirect URI mismatch' error:"
echo "  1. Check Google Cloud Console Authorized Redirect URIs"
echo "  2. Run: docker logs talaseen-backend | grep -i callback"
echo "  3. Verify GOOGLE_CALLBACK_URL in .env"
echo ""
