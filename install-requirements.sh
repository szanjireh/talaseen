#!/bin/bash

# اسکریپت نصب ملزومات برای CI/CD
# Installation script for CI/CD requirements

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================"
echo "  نصب ملزومات CI/CD"
echo "  CI/CD Requirements Installation"
echo "========================================"
echo ""

# تابع چک کردن نصب بودن یک برنامه
check_installed() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 is installed${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is NOT installed${NC}"
        return 1
    fi
}

# تابع نصب Git
install_git() {
    echo -e "${YELLOW}Installing Git...${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y git
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install git
    fi
}

# تابع نصب Docker
install_docker() {
    echo -e "${YELLOW}Installing Docker...${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        echo -e "${GREEN}Docker installed. Please logout and login again.${NC}"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Please download Docker Desktop from: https://www.docker.com/products/docker-desktop"
        open "https://www.docker.com/products/docker-desktop"
    fi
}

# تابع نصب Docker Compose
install_docker_compose() {
    echo -e "${YELLOW}Installing Docker Compose...${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Docker Compose comes with Docker Desktop on macOS"
    fi
}

# تابع نصب Node.js
install_nodejs() {
    echo -e "${YELLOW}Installing Node.js 20...${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node@20
    fi
}

# بررسی سیستم عامل
echo "Detected OS: $OSTYPE"
echo ""

# بررسی Git
echo "1. Checking Git..."
if ! check_installed git; then
    read -p "Install Git? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_git
    fi
fi
echo ""

# بررسی Docker
echo "2. Checking Docker..."
if ! check_installed docker; then
    read -p "Install Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_docker
    fi
else
    docker --version
fi
echo ""

# بررسی Docker Compose
echo "3. Checking Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is NOT installed${NC}"
    read -p "Install Docker Compose? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_docker_compose
    fi
else
    echo -e "${GREEN}✅ Docker Compose is installed${NC}"
    docker compose version
fi
echo ""

# بررسی Node.js
echo "4. Checking Node.js..."
if ! check_installed node; then
    read -p "Install Node.js 20? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_nodejs
    fi
else
    node --version
    required_version=20
    current_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$current_version" -lt "$required_version" ]; then
        echo -e "${YELLOW}⚠️  Node.js version is less than 20${NC}"
        read -p "Upgrade to Node.js 20? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_nodejs
        fi
    fi
fi
echo ""

# بررسی npm
echo "5. Checking npm..."
check_installed npm
if command -v npm &> /dev/null; then
    npm --version
fi
echo ""

# خلاصه
echo "========================================"
echo "  Summary / خلاصه"
echo "========================================"
echo ""

all_good=true

if check_installed git; then
    echo -e "Git: ${GREEN}✅${NC}"
else
    echo -e "Git: ${RED}❌${NC}"
    all_good=false
fi

if check_installed docker; then
    echo -e "Docker: ${GREEN}✅${NC}"
else
    echo -e "Docker: ${RED}❌${NC}"
    all_good=false
fi

if docker compose version &> /dev/null; then
    echo -e "Docker Compose: ${GREEN}✅${NC}"
else
    echo -e "Docker Compose: ${RED}❌${NC}"
    all_good=false
fi

if check_installed node; then
    echo -e "Node.js: ${GREEN}✅${NC}"
else
    echo -e "Node.js: ${RED}❌${NC}"
    all_good=false
fi

if check_installed npm; then
    echo -e "npm: ${GREEN}✅${NC}"
else
    echo -e "npm: ${RED}❌${NC}"
    all_good=false
fi

echo ""

if $all_good; then
    echo -e "${GREEN}✅ All requirements are installed!${NC}"
    echo -e "${GREEN}✅ همه ملزومات نصب شده‌اند!${NC}"
    echo ""
    echo "Next steps / مراحل بعدی:"
    echo "1. Create Docker Hub account: https://hub.docker.com"
    echo "2. Setup GitHub Secrets (see GITHUB_SECRETS.md)"
    echo "3. Test locally: ./test-ci-local.sh"
    echo "4. Push to GitHub: git push origin main"
else
    echo -e "${YELLOW}⚠️  Some requirements are missing${NC}"
    echo -e "${YELLOW}⚠️  برخی از ملزومات نصب نشده‌اند${NC}"
    echo ""
    echo "Please install missing requirements and run this script again."
fi

echo ""
echo "========================================"
