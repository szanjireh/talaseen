#!/bin/bash

echo "🧹 Cleaning and setting up Talaseen..."

# Clean backend
echo "📦 Cleaning backend..."
cd services/backend
rm -rf node_modules package-lock.json dist
npm install
echo "✅ Backend cleaned and installed"

# Clean frontend  
echo "🎨 Cleaning frontend..."
cd ../frontend
rm -rf node_modules package-lock.json .next
npm install
echo "✅ Frontend cleaned and installed"

cd ../..
echo ""
echo "✨ Setup complete! Now run:"
echo "   ./start-all.sh"
