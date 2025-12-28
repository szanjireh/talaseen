# ✅ چک‌لیست راه‌اندازی CI/CD

## قبل از شروع

- [ ] پروژه در GitHub آپلود شده است
- [ ] Git روی سیستم نصب است
- [ ] Docker روی سیستم نصب است
- [ ] Node.js نصب است (نسخه 20 یا بالاتر)

---

## مرحله 1️⃣: تنظیم Docker Hub

- [ ] حساب [Docker Hub](https://hub.docker.com) ساخته شده
- [ ] Repository `username/talaseen-backend` ایجاد شده
- [ ] Repository `username/talaseen-frontend` ایجاد شده
- [ ] Access Token ایجاد شده (Settings → Security → New Access Token)
- [ ] Access Token کپی و ذخیره شده

---

## مرحله 2️⃣: افزودن GitHub Secrets

به مسیر زیر بروید: **Repository → Settings → Secrets and variables → Actions**

### Secrets ضروری (برای Build و Push):
- [ ] `DOCKER_USERNAME` اضافه شده
- [ ] `DOCKER_PASSWORD` اضافه شده (Access Token)

### Secrets اختیاری (برای Deploy خودکار):
- [ ] `SERVER_HOST` اضافه شده (IP یا دامنه سرور)
- [ ] `SERVER_USER` اضافه شده (نام کاربری SSH)
- [ ] `SERVER_PATH` اضافه شده (مسیر پروژه روی سرور)
- [ ] `SSH_PRIVATE_KEY` اضافه شده (کلید خصوصی SSH)

---

## مرحله 3️⃣: بررسی فایل‌های Workflow

- [ ] پوشه `.github/workflows/` موجود است
- [ ] فایل `ci.yml` موجود است
- [ ] فایل `cd.yml` موجود است
- [ ] فایل `deploy.yml` موجود است

---

## مرحله 4️⃣: تست محلی (اختیاری)

```bash
# اجرای تست محلی
./test-ci-local.sh
```

- [ ] تست Backend موفق بود
- [ ] تست Frontend موفق بود
- [ ] Build داکر موفق بود

---

## مرحله 5️⃣: Push به GitHub

```bash
# اضافه کردن فایل‌ها
git add .

# Commit
git commit -m "Add CI/CD pipeline with GitHub Actions"

# Push
git push origin main
```

- [ ] Commit انجام شده
- [ ] Push به GitHub موفق بود

---

## مرحله 6️⃣: بررسی Workflow در GitHub

1. به مخزن GitHub بروید
2. به تب **Actions** بروید

- [ ] Workflow "CI Pipeline" در حال اجراست
- [ ] Workflow "CD Pipeline" در حال اجراست (اگر به main پوش کردید)
- [ ] همه Job ها با موفقیت اجرا شدند (✅ سبز)

---

## مرحله 7️⃣: بررسی Docker Hub

به [Docker Hub](https://hub.docker.com) بروید و Repositories خود را چک کنید:

- [ ] ایمیج `username/talaseen-backend` موجود است
- [ ] ایمیج `username/talaseen-frontend` موجود است
- [ ] Tag `latest` وجود دارد
- [ ] Tag `main` وجود دارد

---

## مرحله 8️⃣: تنظیم سرور (برای Deploy خودکار)

### روی سرور:

```bash
# نصب Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Clone پروژه
git clone https://github.com/username/talaseen.git
cd talaseen

# ایجاد فایل .env
cp .env.example .env
cp services/backend/.env.example services/backend/.env

# ویرایش فایل‌های .env
nano .env
nano services/backend/.env
```

- [ ] Docker روی سرور نصب شده
- [ ] Docker Compose روی سرور نصب شده
- [ ] پروژه Clone شده
- [ ] فایل‌های `.env` ایجاد و تنظیم شده‌اند
- [ ] کلید عمومی SSH اضافه شده (`~/.ssh/authorized_keys`)

---

## مرحله 9️⃣: تست Deploy (اختیاری)

### روش 1: Manual Deploy
1. به GitHub Actions بروید
2. روی "Deploy to Server" کلیک کنید
3. "Run workflow" را بزنید
4. محیط را انتخاب کنید (production)
5. منتظر اتمام Deploy بمانید

### روش 2: Auto Deploy
فقط یک Commit به `main` بزنید:
```bash
git commit -m "Test auto deploy" --allow-empty
git push origin main
```

- [ ] Deploy workflow اجرا شد
- [ ] Deploy با موفقیت انجام شد
- [ ] Health check موفق بود
- [ ] سایت در دسترس است

---

## مرحله 🔟: ایجاد Tag و Release

```bash
# ایجاد Tag
git tag -a v1.0.0 -m "First release"
git push origin v1.0.0
```

- [ ] Tag ایجاد شده
- [ ] Tag به GitHub پوش شده
- [ ] CD Workflow برای Tag اجرا شده
- [ ] ایمیج‌ها با Tag version موجودند (`v1.0.0`)

---

## نکات مهم ⚠️

### امنیت
- ✅ همیشه از Access Token استفاده کنید (نه Password)
- ✅ Secrets را هرگز در کد Commit نکنید
- ✅ کلیدهای SSH را محافظت کنید
- ✅ رمزهای قوی استفاده کنید

### بهترین شیوه‌ها
- ✅ قبل از Push، تست محلی انجام دهید
- ✅ Commit های معنی‌دار بنویسید
- ✅ از Branching strategy استفاده کنید (main, develop, feature)
- ✅ Code review انجام دهید

### مانیتورینگ
- 📊 لاگ‌های Actions را بررسی کنید
- 📊 حجم ایمیج‌های Docker را چک کنید
- 📊 زمان Build را بهینه کنید
- 📊 Health check سرور را مانیتور کنید

---

## مشکلات رایج و راه‌حل 🔧

### ❌ خطای Authentication
**علت:** Secrets اشتباه یا ناقص
**راه‌حل:** Secrets را مجدد بررسی و تنظیم کنید

### ❌ خطای Build
**علت:** Dependencies ناقص یا نسخه Node.js
**راه‌حل:** `package.json` و `package-lock.json` را بررسی کنید

### ❌ خطای SSH
**علت:** کلید SSH اشتباه یا دسترسی
**راه‌حل:** کلید عمومی را روی سرور اضافه کنید

### ❌ خطای Docker
**علت:** Dockerfile یا Docker Compose
**راه‌حل:** Syntax فایل‌ها را بررسی کنید

---

## منابع مفید 📚

- [راهنمای کامل فارسی](CICD_SETUP_GUIDE.md)
- [راهنمای GitHub Secrets](GITHUB_SECRETS.md)
- [Workflow README](.github/workflows/README.md)
- [مستندات GitHub Actions](https://docs.github.com/en/actions)
- [مستندات Docker Hub](https://docs.docker.com/docker-hub/)

---

## تبریک! 🎉

اگر همه موارد بالا را تیک زدید، پایپ‌لاین CI/CD شما آماده است!

### مراحل بعدی:
1. ✨ یک feature جدید اضافه کنید
2. 🔄 PR ایجاد کنید و CI را ببینید
3. 🚀 به main مرج کنید و Deploy را تماشا کنید
4. 📦 Tag بزنید و Release کنید

**موفق باشید!** 🚀
