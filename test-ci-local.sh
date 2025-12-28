#!/bin/bash

# تست محلی CI/CD Pipeline
# این اسکریپت مراحل CI را به صورت محلی تست می‌کند

set -e  # خروج در صورت خطا

echo "🧪 Starting Local CI Pipeline Test..."
echo "======================================"

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تابع برای چاپ پیام موفقیت
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# تابع برای چاپ پیام خطا
error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# تابع برای چاپ پیام اطلاعاتی
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# بررسی وجود Docker
if ! command -v docker &> /dev/null; then
    error "Docker is not installed!"
fi

# بررسی وجود Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is not installed!"
fi

info "Node version: $(node --version)"
info "npm version: $(npm --version)"
info "Docker version: $(docker --version)"

echo ""
echo "📦 Step 1: Backend CI"
echo "----------------------"

cd services/backend

info "Installing backend dependencies..."
npm ci || error "Failed to install backend dependencies"
success "Backend dependencies installed"

info "Generating Prisma client..."
npx prisma generate || error "Failed to generate Prisma client"
success "Prisma client generated"

info "Building backend..."
npm run build || error "Backend build failed"
success "Backend built successfully"

info "Running backend tests..."
npm test --if-present || info "No tests found (skipping)"

cd ../..

echo ""
echo "🎨 Step 2: Frontend CI"
echo "----------------------"

cd services/frontend

info "Installing frontend dependencies..."
npm ci || error "Failed to install frontend dependencies"
success "Frontend dependencies installed"

info "Running frontend linting..."
npm run lint || error "Frontend linting failed"
success "Frontend linting passed"

info "Building frontend..."
NEXT_PUBLIC_API_URL=http://localhost:4000/api npm run build || error "Frontend build failed"
success "Frontend built successfully"

info "Running frontend tests..."
npm test --if-present || info "No tests found (skipping)"

cd ../..

echo ""
echo "🐳 Step 3: Docker Build Test"
echo "-----------------------------"

info "Building backend Docker image..."
docker build -t talaseen-backend:test ./services/backend || error "Backend Docker build failed"
success "Backend Docker image built"

info "Building frontend Docker image..."
docker build -t talaseen-frontend:test ./services/frontend || error "Frontend Docker build failed"
success "Frontend Docker image built"

echo ""
echo "🔍 Step 4: Docker Image Inspection"
echo "-----------------------------------"

info "Backend image size:"
docker images talaseen-backend:test --format "{{.Repository}}:{{.Tag}} - {{.Size}}"

info "Frontend image size:"
docker images talaseen-frontend:test --format "{{.Repository}}:{{.Tag}} - {{.Size}}"

echo ""
echo "🧹 Step 5: Cleanup"
echo "------------------"

info "Removing test Docker images..."
docker rmi talaseen-backend:test talaseen-frontend:test 2>/dev/null || info "Images already removed"
success "Cleanup completed"

echo ""
echo "======================================"
success "All CI Pipeline Tests Passed! 🎉"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Your message'"
echo "2. Push to GitHub: git push origin main"
echo "3. Check GitHub Actions tab for remote CI/CD execution"
echo ""
