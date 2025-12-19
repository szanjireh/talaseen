#!/bin/bash

echo "🔧 رفع مشکلات Frontend..."
echo ""

# Kill frontend process
echo "🛑 متوقف کردن Frontend..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2

# Go to frontend directory
cd /home/sajad/talaseen/services/frontend

# Clean
echo "🧹 پاک‌سازی..."
rm -rf node_modules package-lock.json .next

# Install dependencies
echo "📦 نصب dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ خطا در نصب dependencies"
    exit 1
fi

echo "✅ نصب با موفقیت انجام شد"

# Start frontend
echo "🚀 اجرای Frontend..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "✅ Frontend اجرا شد (PID: $FRONTEND_PID)"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "📋 لاگ: tail -f frontend.log"
echo "🛑 متوقف: kill $FRONTEND_PID"
echo ""
echo "💡 اگر خطاهای TypeScript در VS Code باقی ماند:"
echo "   1. Ctrl+Shift+P"
echo "   2. TypeScript: Restart TS Server"
echo ""
