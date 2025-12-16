#!/bin/bash

echo "🚀 Setting up Talaseen Gold Marketplace..."

# Copy .env.example to .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your settings."
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd services/backend && npm install && cd ../..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd services/frontend && npm install && cd ../..

# Install vendor-panel dependencies
echo "📦 Installing vendor panel dependencies..."
cd services/vendor-panel && npm install && cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Start services:"
echo "   - With Docker: npm run docker:up"
echo "   - Without Docker:"
echo "     - Start PostgreSQL database"
echo "     - Run: npm run dev"
echo ""
echo "3. Access the applications:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:4000"
echo "   - Vendor Panel: http://localhost:5173"
echo ""
