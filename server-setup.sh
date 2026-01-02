#!/bin/bash

# راهنمای راه‌اندازی پروژه Talaseen روی سرور
# ==========================================

echo "🚀 راهنمای راه‌اندازی پروژه Talaseen"
echo "====================================="
echo ""

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# مرحله 1: چک کردن Docker
echo -e "${BLUE}📋 مرحله 1: چک کردن نیازمندی‌ها${NC}"
echo "================================"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker نصب نیست!${NC}"
    echo "برای نصب Docker اجرا کنید:"
    echo "  curl -fsSL https://get.docker.com | sh"
    echo "  sudo usermod -aG docker \$USER"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose نصب نیست!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker و Docker Compose نصب هستند${NC}"
echo ""

# مرحله 2: تنظیم فایل .env
echo -e "${BLUE}📋 مرحله 2: تنظیم فایل Environment${NC}"
echo "================================"

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  فایل .env وجود ندارد!${NC}"
    
    if [ -f .env.production ]; then
        echo "کپی کردن از .env.production..."
        cp .env.production .env
        echo -e "${GREEN}✅ فایل .env ساخته شد${NC}"
        echo ""
        echo -e "${YELLOW}🔐 لطفاً فایل .env را ویرایش کنید و این موارد را تغییر دهید:${NC}"
        echo "  1. POSTGRES_PASSWORD - پسورد دیتابیس"
        echo "  2. JWT_SECRET - کلید امنیتی JWT"
        echo "  3. JWT_REFRESH_SECRET - کلید رفرش توکن"
        echo ""
        echo "برای ساخت کلید امن:"
        echo "  openssl rand -base64 32"
        echo ""
        echo -e "${RED}❗ بعد از ویرایش .env، این اسکریپت را دوباره اجرا کنید${NC}"
        exit 0
    else
        echo -e "${RED}❌ فایل .env.production هم وجود ندارد!${NC}"
        echo "لطفاً ابتدا فایل .env.production را بسازید"
        exit 1
    fi
else
    echo -e "${GREEN}✅ فایل .env موجود است${NC}"
fi
echo ""

# مرحله 3: چک کردن تنظیمات .env
echo -e "${BLUE}📋 مرحله 3: بررسی تنظیمات${NC}"
echo "================================"

# چک کردن پسورد
if grep -q "CHANGE_THIS" .env; then
    echo -e "${RED}❌ هنوز پسوردها و کلیدها را تغییر ندادید!${NC}"
    echo "لطفاً فایل .env را ویرایش کنید:"
    echo "  nano .env"
    echo "  # یا"
    echo "  vim .env"
    exit 1
fi

echo -e "${GREEN}✅ تنظیمات به نظر درست است${NC}"
echo ""

# مرحله 4: ساخت پوشه‌های لازم
echo -e "${BLUE}📋 مرحله 4: ساخت پوشه‌های لازم${NC}"
echo "================================"

mkdir -p services/backend/uploads/products
mkdir -p services/backend/uploads/profiles
chmod -R 755 services/backend/uploads

echo -e "${GREEN}✅ پوشه‌های uploads ساخته شدند${NC}"
echo ""

# مرحله 5: توقف containerهای قبلی
echo -e "${BLUE}📋 مرحله 5: پاک کردن containerهای قبلی${NC}"
echo "================================"

if docker compose ps -q | grep -q .; then
    echo "توقف containerهای در حال اجرا..."
    docker compose down
    echo -e "${GREEN}✅ Containerها متوقف شدند${NC}"
else
    echo "هیچ container فعالی وجود ندارد"
fi
echo ""

# مرحله 6: Build و اجرا
echo -e "${BLUE}📋 مرحله 6: Build و اجرای پروژه${NC}"
echo "================================"
echo "این مرحله ممکن است چند دقیقه طول بکشد..."
echo ""

docker compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ پروژه با موفقیت اجرا شد!${NC}"
else
    echo ""
    echo -e "${RED}❌ خطا در اجرای پروژه${NC}"
    echo "برای دیدن لاگ‌ها:"
    echo "  docker compose logs"
    exit 1
fi
echo ""

# مرحله 7: چک کردن وضعیت
echo -e "${BLUE}📋 مرحله 7: چک کردن وضعیت سرویس‌ها${NC}"
echo "================================"

sleep 5
docker compose ps

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 راه‌اندازی کامل شد!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# دریافت IP سرور
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "185.255.91.45")

echo "🌐 لینک‌های دسترسی:"
echo "  Frontend: http://${SERVER_IP}:3002"
echo "  Backend:  http://${SERVER_IP}:4000"
echo "  API Docs: http://${SERVER_IP}:4000/api"
echo ""
echo "📊 دستورات مفید:"
echo "  # دیدن لاگ‌های زنده:"
echo "  docker compose logs -f"
echo ""
echo "  # دیدن لاگ یک سرویس خاص:"
echo "  docker compose logs -f backend"
echo "  docker compose logs -f frontend"
echo ""
echo "  # Restart کردن سرویس‌ها:"
echo "  docker compose restart"
echo ""
echo "  # توقف همه چیز:"
echo "  docker compose down"
echo ""
echo "  # پاک کردن همه چیز (با احتیاط!):"
echo "  docker compose down -v"
echo ""
echo -e "${YELLOW}💡 نکته: اگر تغییری در کد دادید، باید rebuild کنید:${NC}"
echo "  docker compose up -d --build"
echo ""
