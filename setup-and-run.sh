#!/bin/bash

echo "🔧 حل تمام مشکلات و اجرای Talaseen"
echo ""

# Kill all processes
echo "🛑 متوقف کردن پروسس‌های قبلی..."
lsof -ti:4000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
pkill -f "nest start" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Clean everything
echo "🧹 پاک‌سازی..."
rm -rf /home/sajad/talaseen/node_modules
cd /home/sajad/talaseen/services/backend
rm -rf node_modules package-lock.json dist
cd /home/sajad/talaseen/services/frontend
rm -rf node_modules package-lock.json .next

# Install backend
echo "📦 نصب Backend..."
cd /home/sajad/talaseen/services/backend
npm install --legacy-peer-deps
echo "✅ Backend installed"

# Install frontend
echo "🎨 نصب Frontend..."
cd /home/sajad/talaseen/services/frontend
npm install --legacy-peer-deps
echo "✅ Frontend installed"

# Start backend
echo "🚀 اجرای Backend..."
cd /home/sajad/talaseen/services/backend
npm run start:dev > ../../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait for backend
sleep 5

# Start frontend
echo "🚀 اجرای Frontend..."
cd /home/sajad/talaseen/services/frontend
npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

cd /home/sajad/talaseen

echo ""
echo "✅ همه چیز آماده است!"
echo ""
echo "📍 Backend:  http://localhost:4000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "📋 لاگ‌ها:"
echo "   tail -f backend.log"
echo "   tail -f frontend.log"
echo ""
echo "🛑 برای متوقف کردن:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
