#!/bin/bash

# اسکریپت دیپلوی خودکار پروژه Talaseen به سرور
# ===================================================

set -e  # توقف در صورت خطا

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# تنظیمات سرور (از SSH config)
SERVER_HOST="talaseencom"
SERVER_PATH="/home/yousef/talaseen"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 دیپلوی پروژه Talaseen به سرور  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# ========================================
# مرحله 1: تست اتصال به سرور
# ========================================
echo -e "${BLUE}[1/8]${NC} 📡 تست اتصال به سرور..."

if ! ssh $SERVER_HOST "echo 'Connected'" &>/dev/null; then
    echo -e "${RED}❌ خطا: نمی‌توانم به سرور متصل شوم!${NC}"
    echo ""
    echo "لطفاً چک کنید:"
    echo "  1. فایل SSH config: ~/.ssh/config"
    echo "  2. کلید SSH: ~/.ssh/id_ed25519_talaseencom"
    echo "  3. دسترسی به سرور"
    echo ""
    echo "برای تست اتصال:"
    echo "  ssh $SERVER_HOST"
    exit 1
fi

echo -e "${GREEN}✅ اتصال موفق${NC}"
echo ""

# ========================================
# مرحله 2: چک کردن Docker روی سرور
# ========================================
echo -e "${BLUE}[2/8]${NC} 🐳 چک کردن Docker روی سرور..."

if ! ssh $SERVER_HOST "command -v docker &>/dev/null"; then
    echo -e "${RED}❌ Docker روی سرور نصب نیست!${NC}"
    echo ""
    echo "برای نصب Docker روی سرور:"
    echo "  ssh $SERVER_HOST"
    echo "  curl -fsSL https://get.docker.com | sh"
    echo "  sudo usermod -aG docker \$USER"
    echo "  exit"
    echo "  # سپس دوباره login کنید"
    exit 1
fi

if ! ssh $SERVER_HOST "docker compose version &>/dev/null"; then
    echo -e "${RED}❌ Docker Compose روی سرور نصب نیست!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker نصب است${NC}"
echo ""

# ========================================
# مرحله 3: ساخت پوشه روی سرور
# ========================================
echo -e "${BLUE}[3/8]${NC} 📁 ساخت پوشه پروژه..."

ssh $SERVER_HOST "mkdir -p $SERVER_PATH"
echo -e "${GREEN}✅ پوشه ساخته شد${NC}"
echo ""

# ========================================
# مرحله 4: آپلود فایل‌ها
# ========================================
echo -e "${BLUE}[4/8]${NC} 📤 آپلود فایل‌های پروژه..."
echo "این مرحله ممکن است چند دقیقه طول بکشد..."
echo ""

rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.next' \
    --exclude='uploads' \
    --exclude='postgres_data' \
    --exclude='.env' \
    ./ $SERVER_HOST:$SERVER_PATH/

echo ""
echo -e "${GREEN}✅ فایل‌ها آپلود شدند${NC}"
echo ""

# ========================================
# مرحله 5: چک کردن فایل .env
# ========================================
echo -e "${BLUE}[5/8]${NC} ⚙️  بررسی فایل Environment..."

if ssh $SERVER_HOST "[ -f $SERVER_PATH/.env ]"; then
    echo -e "${GREEN}✅ فایل .env موجود است${NC}"
else
    echo -e "${YELLOW}⚠️  فایل .env وجود ندارد، ساخته می‌شود...${NC}"
    
    # ساخت فایل .env با پسورد رندوم
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)
    
    ssh $SERVER_HOST "cat > $SERVER_PATH/.env" << EOL
# Database
POSTGRES_USER=talaseen
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DB=talaseen

# Backend
DATABASE_URL=postgresql://talaseen:$DB_PASSWORD@postgres:5432/talaseen
PORT=4000
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Frontend
NEXT_PUBLIC_API_URL=http://185.255.91.45:4000/api
NEXT_PUBLIC_BACKEND_URL=http://185.255.91.45:4000
FRONTEND_URL=http://185.255.91.45:3002

# Production
NODE_ENV=production
EOL
    
    echo -e "${GREEN}✅ فایل .env با تنظیمات امن ساخته شد${NC}"
fi
echo ""

# ========================================
# مرحله 6: ساخت پوشه‌های لازم
# ========================================
echo -e "${BLUE}[6/8]${NC} 📂 ساخت پوشه‌های لازم..."

ssh $SERVER_HOST "cd $SERVER_PATH && mkdir -p services/backend/uploads/products services/backend/uploads/profiles && chmod -R 755 services/backend/uploads"

echo -e "${GREEN}✅ پوشه‌ها آماده شدند${NC}"
echo ""

# ========================================
# مرحله 7: توقف containerهای قبلی
# ========================================
echo -e "${BLUE}[7/8]${NC} 🛑 توقف containerهای قبلی..."

ssh $SERVER_HOST "cd $SERVER_PATH && docker compose down 2>/dev/null || true"

echo -e "${GREEN}✅ containerهای قبلی متوقف شدند${NC}"
echo ""

# ========================================
# مرحله 8: اجرای پروژه
# ========================================
echo -e "${BLUE}[8/8]${NC} 🚀 اجرای پروژه..."
echo "این مرحله چند دقیقه طول می‌کشد (Build کردن Docker images)..."
echo ""

if ssh $SERVER_HOST "cd $SERVER_PATH && docker compose up -d --build"; then
    echo ""
    echo -e "${GREEN}✅ پروژه با موفقیت اجرا شد!${NC}"
else
    echo ""
    echo -e "${RED}❌ خطا در اجرای پروژه${NC}"
    echo ""
    echo "برای دیدن لاگ‌ها:"
    echo "  ssh $SERVER_HOST 'cd $SERVER_PATH && docker compose logs'"
    exit 1
fi
echo ""

# ========================================
# نمایش وضعیت
# ========================================
sleep 5

echo -e "${BLUE}📊 وضعیت سرویس‌ها:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ssh $SERVER_HOST "cd $SERVER_PATH && docker compose ps"
echo ""

# ========================================
# نمایش اطلاعات نهایی
# ========================================
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✨ دیپلوی با موفقیت انجام شد! ✨   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}🌐 لینک‌های دسترسی:${NC}"
echo "  🎨 Frontend: http://185.255.91.45:3002"
echo "  ⚙️  Backend:  http://185.255.91.45:4000"
echo "  📚 API Docs: http://185.255.91.45:4000/api"
echo ""
echo -e "${YELLOW}📊 دستورات مفید:${NC}"
echo ""
echo "  # دیدن لاگ‌های زنده:"
echo "  ssh $SERVER_HOST 'cd $SERVER_PATH && docker compose logs -f'"
echo ""
echo "  # دیدن لاگ یک سرویس:"
echo "  ssh $SERVER_HOST 'cd $SERVER_PATH && docker compose logs -f backend'"
echo ""
echo "  # Restart سرویس‌ها:"
echo "  ssh $SERVER_HOST 'cd $SERVER_PATH && docker compose restart'"
echo ""
echo "  # توقف پروژه:"
echo "  ssh $SERVER_HOST 'cd $SERVER_PATH && docker compose down'"
echo ""
echo "  # اتصال به سرور:"
echo "  ssh $SERVER_HOST"
echo ""
echo -e "${BLUE}💡 نکته:${NC} برای دیپلوی تغییرات جدید، دوباره این اسکریپت را اجرا کنید:"
echo "  ./deploy.sh"
echo ""
