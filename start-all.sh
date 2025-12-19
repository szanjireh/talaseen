#!/bin/bash

echo "🚀 Starting Talaseen Marketplace..."

# Start backend
echo "📦 Starting Backend..."
cd services/backend
npm run start:dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Start frontend
echo "🎨 Starting Frontend..."
cd ../frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

cd ../..

echo ""
echo "✅ Services started!"
echo "📍 Backend: http://localhost:4000 (check services/backend/backend.log)"
echo "📍 Frontend: http://localhost:3000 (check services/frontend/frontend.log)"
echo ""
echo "📝 To view logs:"
echo "   tail -f services/backend/backend.log"
echo "   tail -f services/frontend/frontend.log"
echo ""
echo "🛑 To stop:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
