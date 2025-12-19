#!/bin/bash

echo "🔍 بررسی وضعیت برنامه..."
echo ""

# Check if ports are in use
BACKEND_PORT=$(lsof -ti:4000 2>/dev/null)
FRONTEND_PORT=$(lsof -ti:3000 2>/dev/null)

if [ -n "$BACKEND_PORT" ]; then
    echo "✅ Backend در حال اجراست (PID: $BACKEND_PORT)"
    BACKEND_RUNNING=true
else
    echo "❌ Backend در حال اجرا نیست"
    BACKEND_RUNNING=false
fi

if [ -n "$FRONTEND_PORT" ]; then
    echo "✅ Frontend در حال اجراست (PID: $FRONTEND_PORT)"
    FRONTEND_RUNNING=true
else
    echo "❌ Frontend در حال اجرا نیست"
    FRONTEND_RUNNING=false
fi

echo ""

# If both are running
if [ "$BACKEND_RUNNING" = true ] && [ "$FRONTEND_RUNNING" = true ]; then
    echo "✅ همه چیز در حال اجراست!"
    echo ""
    echo "📍 Backend:  http://localhost:4000"
    echo "📍 Frontend: http://localhost:3000"
    echo ""
    echo "📋 برای مشاهده لاگ‌ها:"
    echo "   Backend:  tail -f backend.log"
    echo "   Frontend: tail -f frontend.log"
    echo ""
    echo "🛑 برای متوقف کردن:"
    echo "   kill $BACKEND_PORT $FRONTEND_PORT"
    exit 0
fi

# If something is not running, restart everything
echo "🔄 راه‌اندازی مجدد..."
echo ""

# Kill existing processes
if [ -n "$BACKEND_PORT" ]; then
    echo "🛑 متوقف کردن Backend..."
    kill -9 $BACKEND_PORT 2>/dev/null
fi

if [ -n "$FRONTEND_PORT" ]; then
    echo "🛑 متوقف کردن Frontend..."
    kill -9 $FRONTEND_PORT 2>/dev/null
fi

sleep 2

# Start backend
echo "🚀 اجرای Backend..."
cd /home/sajad/talaseen/services/backend
npm run start:dev > ../../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait for backend to initialize
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
echo "📋 برای مشاهده لاگ‌ها:"
echo "   tail -f backend.log"
echo "   tail -f frontend.log"
echo ""
echo "🛑 برای متوقف کردن:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
