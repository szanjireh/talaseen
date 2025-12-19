#!/bin/bash

echo "✨ نصب و اجرای Talaseen"
echo ""

# Kill existing processes
echo "🛑 متوقف کردن پروسس‌های قبلی..."
pkill -f "nest start" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Backend
echo "📦 نصب Backend..."
cd services/backend
rm -rf node_modules package-lock.json dist
npm install --legacy-peer-deps
echo ""

# Frontend  
echo "🎨 نصب Frontend..."
cd ../frontend
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps
echo ""

# Start services
echo "🚀 اجرای سرویس‌ها..."
cd ..

# Start backend
echo "Starting backend..."
cd backend
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting frontend..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ سرویس‌ها در حال اجرا هستند!"
echo ""
echo "📍 Backend:  http://localhost:4000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "📋 لاگ‌ها:"
echo "   tail -f services/backend.log"
echo "   tail -f services/frontend.log"
echo ""
echo "🛑 برای متوقف کردن:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   یا: pkill -f 'nest start' && pkill -f 'next dev'"
echo ""

# Save PIDs
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo "PIDs ذخیره شد در .backend.pid و .frontend.pid"
