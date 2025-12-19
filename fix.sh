#!/bin/bash

echo "🔧 Fixing Talaseen Project Issues..."

# Remove unnecessary directories
echo "📁 Cleaning up unnecessary directories..."
rm -rf services/next-frontend
rm -rf services/vendor-panel/dist
rm -rf services/vendor-panel/node_modules

# Copy environment files if they don't exist
echo "📝 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created root .env file"
fi

if [ ! -f services/backend/.env ]; then
    cp services/backend/.env.example services/backend/.env
    echo "✅ Created backend .env file"
fi

if [ ! -f services/frontend/.env.local ]; then
    cp services/frontend/.env.example services/frontend/.env.local
    echo "✅ Created frontend .env.local file"
fi

echo ""
echo "✅ All issues fixed!"
echo ""
echo "⚠️  IMPORTANT: Update the following in your .env files:"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - JWT_SECRET (use a strong random string)"
echo "   - JWT_REFRESH_SECRET (use a different strong random string)"
echo ""
echo "Next steps:"
echo "1. Update .env files with your credentials"
echo "2. Run: ./setup.sh"
echo "3. Run: ./quickstart.sh"
echo ""
