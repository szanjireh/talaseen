#!/bin/bash

echo "🛑 متوقف کردن تمام سرویس‌ها..."
echo ""

# Stop backend (port 4000)
BACKEND_PID=$(lsof -ti:4000 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
    echo "🛑 متوقف کردن Backend (PID: $BACKEND_PID)..."
    kill -9 $BACKEND_PID 2>/dev/null
    echo "✅ Backend متوقف شد"
else
    echo "ℹ️  Backend در حال اجرا نبود"
fi

# Stop frontend (port 3000)
FRONTEND_PID=$(lsof -ti:3000 2>/dev/null)
if [ -n "$FRONTEND_PID" ]; then
    echo "🛑 متوقف کردن Frontend (PID: $FRONTEND_PID)..."
    kill -9 $FRONTEND_PID 2>/dev/null
    echo "✅ Frontend متوقف شد"
else
    echo "ℹ️  Frontend در حال اجرا نبود"
fi

# Kill any remaining nest/next processes
pkill -f "nest start" 2>/dev/null
pkill -f "next dev" 2>/dev/null

echo ""
echo "✅ تمام سرویس‌ها متوقف شدند"
echo ""
