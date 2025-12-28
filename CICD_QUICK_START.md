# 📚 راهنمای سریع CI/CD - Quick Start Guide

## 🎯 شروع سریع (Quick Start)

### 1️⃣ بررسی و نصب ملزومات
```bash
# اجرای اسکریپت نصب
./install-requirements.sh
```

**ملزومات مورد نیاز:**
- ✅ Git
- ✅ Docker & Docker Compose
- ✅ Node.js 20+
- ✅ حساب کاربری Docker Hub
- ✅ حساب کاربری GitHub

---

### 2️⃣ تنظیم Docker Hub

1. به [Docker Hub](https://hub.docker.com) بروید و ثبت‌نام کنید
2. دو Repository ایجاد کنید:
   - `your-username/talaseen-backend`
   - `your-username/talaseen-frontend`
3. یک Access Token بسازید:
   - Settings → Security → New Access Token
   - دسترسی: Read & Write
   - Token را کپی و ذخیره کنید

---

### 3️⃣ افزودن GitHub Secrets

**مسیر:** Repository → Settings → Secrets and variables → Actions

**Secrets ضروری:**
```
DOCKER_USERNAME = your_dockerhub_username
DOCKER_PASSWORD = your_access_token
```

**Secrets اختیاری (برای deploy خودکار):**
```
SERVER_HOST = your_server_ip
SERVER_USER = ssh_username
SERVER_PATH = /path/to/project
SSH_PRIVATE_KEY = your_ssh_private_key
```

📖 **راهنمای کامل:** [GITHUB_SECRETS.md](GITHUB_SECRETS.md)

---

### 4️⃣ تست محلی (اختیاری)

```bash
# تست کامل pipeline
./test-ci-local.sh
```

این اسکریپت موارد زیر را تست می‌کند:
- ✅ Build Backend
- ✅ Build Frontend
- ✅ Linting
- ✅ Docker Image Build

---

### 5️⃣ Push به GitHub

```bash
# اضافه کردن فایل‌های جدید
git add .

# Commit
git commit -m "Add CI/CD pipeline"

# Push
git push origin main
```

---

### 6️⃣ مشاهده نتیجه

1. به مخزن GitHub بروید
2. تب **Actions** را باز کنید
3. Workflow های در حال اجرا را ببینید:
   - 🧪 **CI Pipeline**: تست و Build
   - 🚀 **CD Pipeline**: Push به Docker Hub
   - 🌐 **Deploy**: استقرار روی سرور (اختیاری)

---

## 📁 فایل‌های ایجاد شده

### Workflow Files
```
.github/workflows/
├── ci.yml          # پایپ‌لاین CI
├── cd.yml          # پایپ‌لاین CD
├── deploy.yml      # پایپ‌لاین Deploy
└── README.md       # توضیحات Workflows
```

### Documentation Files
```
CICD_SETUP_GUIDE.md      # راهنمای کامل فارسی (9.3 KB)
GITHUB_SECRETS.md        # راهنمای Secrets (4.6 KB)
CICD_CHECKLIST.md        # چک‌لیست راه‌اندازی (6.6 KB)
CICD_QUICK_START.md      # این فایل
```

### Script Files
```
test-ci-local.sh         # تست محلی CI (3.5 KB)
install-requirements.sh  # نصب ملزومات (5.2 KB)
.env.github.example      # نمونه متغیرها
```

---

## 🔄 Workflow ها

### CI Pipeline (`.github/workflows/ci.yml`)
**زمان اجرا:** هر Push یا PR به main/develop

**مراحل:**
1. نصب Dependencies
2. Prisma Generate
3. Build Backend
4. Lint Frontend
5. Build Frontend
6. تست Build داکر

**نیاز به Secret:** خیر

---

### CD Pipeline (`.github/workflows/cd.yml`)
**زمان اجرا:** Push به main یا Tag

**مراحل:**
1. Build ایمیج Docker
2. Login به Docker Hub
3. Push ایمیج‌ها
4. Tag خودکار (latest, version, sha)

**Secrets مورد نیاز:**
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

---

### Deploy Pipeline (`.github/workflows/deploy.yml`)
**زمان اجرا:** دستی یا خودکار

**مراحل:**
1. SSH به سرور
2. Pull کد جدید
3. Pull ایمیج‌های جدید
4. اجرای Migrations
5. راه‌اندازی مجدد
6. Health Check

**Secrets مورد نیاز:**
- همه Secrets Docker Hub
- همه Secrets سرور

---

## 🏷️ Version Tagging

```bash
# ایجاد Tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push Tag
git push origin v1.0.0
```

این کار باعث می‌شود:
- CD Pipeline اجرا شود
- ایمیج‌ها با Tag `v1.0.0` ساخته شوند
- ایمیج‌ها در Docker Hub ذخیره شوند

---

## 🎯 دستورات مفید

### تست محلی
```bash
./test-ci-local.sh
```

### بررسی ملزومات
```bash
./install-requirements.sh
```

### اجرای دستی Deploy
1. GitHub → Actions → Deploy to Server
2. Run workflow → انتخاب environment → Run

### مشاهده لاگ‌های Docker
```bash
docker compose logs -f
```

### Rollback در صورت مشکل
```bash
git revert HEAD
git push origin main
```

---

## 🔍 عیب‌یابی

### ❌ خطای Docker Authentication
```
Error: Cannot perform an interactive login
```
**راه‌حل:** بررسی Secrets در GitHub

### ❌ خطای Build
```
npm ERR! code ELIFECYCLE
```
**راه‌حل:** بررسی Dependencies و نسخه Node.js

### ❌ خطای SSH
```
Permission denied (publickey)
```
**راه‌حل:** بررسی کلید SSH و authorized_keys

---

## 📖 مستندات کامل

| فایل | توضیحات | زبان |
|------|---------|------|
| [CICD_SETUP_GUIDE.md](CICD_SETUP_GUIDE.md) | راهنمای کامل راه‌اندازی | 🇮🇷 فارسی |
| [GITHUB_SECRETS.md](GITHUB_SECRETS.md) | راهنمای Secrets | 🇬🇧 English |
| [CICD_CHECKLIST.md](CICD_CHECKLIST.md) | چک‌لیست گام‌به‌گام | 🇮🇷 فارسی |
| [.github/workflows/README.md](.github/workflows/README.md) | توضیحات Workflows | 🇬🇧 English |

---

## 🎓 منابع آموزشی

### ویدیوها و آموزش‌ها
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)

### ابزارها
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Docker Hub](https://hub.docker.com)
- [Act - Test Actions Locally](https://github.com/nektos/act)

---

## ✅ چک‌لیست نهایی

قبل از Production:
- [ ] همه تست‌ها با موفقیت اجرا می‌شوند
- [ ] Secrets به درستی تنظیم شده‌اند
- [ ] ایمیج‌ها در Docker Hub موجودند
- [ ] فایل‌های `.env` روی سرور تنظیم شده‌اند
- [ ] Database migrations اجرا شده‌اند
- [ ] Health checks موفق هستند
- [ ] Backup از Database گرفته شده
- [ ] Monitoring فعال است

---

## 🚀 مراحل بعدی

پس از راه‌اندازی موفق CI/CD:

1. **Monitoring**
   - اضافه کردن لاگ‌ها
   - تنظیم Alert ها
   - مانیتور کردن Performance

2. **Security**
   - تنظیم Branch Protection
   - Require PR Reviews
   - اضافه کردن Security Scanning

3. **Optimization**
   - بهینه‌سازی Docker Images
   - کاهش زمان Build
   - استفاده از Cache

4. **Advanced Features**
   - Environment های جداگانه (Staging/Production)
   - Manual Approval برای Production
   - Notifications (Slack, Discord, Email)
   - Automated Testing بیشتر

---

## 💬 پشتیبانی

اگر با مشکلی مواجه شدید:

1. ✅ [چک‌لیست](CICD_CHECKLIST.md) را بررسی کنید
2. 📖 [راهنمای کامل](CICD_SETUP_GUIDE.md) را مطالعه کنید
3. 🔍 لاگ‌های Actions را چک کنید
4. 🐛 Issues در GitHub ایجاد کنید

---

## 🎉 تبریک!

اگر تا اینجا آمده‌اید، CI/CD Pipeline شما آماده است!

**موفق باشید!** 🚀

---

**آخرین بروزرسانی:** 28 دسامبر 2025  
**نسخه:** 1.0.0
