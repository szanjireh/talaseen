# 🚀 راهنمای دیپلوی پروژه Talaseen به سرور

## 📋 پیش‌نیازها

روی **کامپیوتر محلی** (local):
- SSH config تنظیم شده (`~/.ssh/config`)
- کلید SSH در دسترس (`~/.ssh/id_ed25519_talaseencom`)
- `rsync` نصب باشه

روی **سرور**:
- Docker نصب باشه
- Docker Compose نصب باشه
- دسترسی sudo (فقط برای نصب Docker)

---

## 🎯 روش اول: دیپلوی خودکار (پیشنهادی)

این روش تمام مراحل رو خودکار انجام میده:

### 1️⃣ از کامپیوتر محلی:

```bash
cd /home/sajad/talaseen
./deploy.sh
```

این اسکریپت:
- ✅ اتصال به سرور رو چک می‌کنه
- ✅ Docker رو بررسی می‌کنه
- ✅ فایل‌ها رو آپلود می‌کنه
- ✅ فایل `.env` رو می‌سازه (با پسوردهای امن رندوم)
- ✅ پوشه‌های لازم رو می‌سازه
- ✅ پروژه رو Build و اجرا می‌کنه

### 2️⃣ صبر کنید تا تموم بشه!

Build کردن حدود 5-10 دقیقه طول می‌کشه.

### 3️⃣ تست کنید:

- Frontend: http://185.255.91.45:3002
- Backend: http://185.255.91.45:4000

---

## 🔧 روش دوم: دیپلوی دستی

اگه می‌خواید خودتون قدم به قدم انجام بدید:

### 1️⃣ آپلود فایل‌ها به سرور:

```bash
rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='uploads' \
    ./ talaseencom:/home/yousef/talaseen/
```

### 2️⃣ اتصال به سرور:

```bash
ssh talaseencom
cd /home/yousef/talaseen
```

### 3️⃣ اجرای اسکریپت راه‌اندازی:

```bash
./server-setup.sh
```

این اسکریپت:
- چک می‌کنه Docker نصبه یا نه
- فایل `.env` رو از `.env.production` کپی می‌کنه
- بهتون میگه که چی رو باید تغییر بدید
- پروژه رو Build و اجرا می‌کنه

### 4️⃣ ویرایش فایل `.env`:

```bash
nano .env
```

**حتماً این موارد رو تغییر بدید:**
- `POSTGRES_PASSWORD` - پسورد دیتابیس
- `JWT_SECRET` - کلید JWT
- `JWT_REFRESH_SECRET` - کلید رفرش توکن

برای ساخت کلید امن:
```bash
openssl rand -base64 32
```

### 5️⃣ اجرای مجدد:

```bash
./server-setup.sh
```

---

## 📊 دستورات مفید روی سرور

### دیدن وضعیت سرویس‌ها:
```bash
cd /home/yousef/talaseen
docker compose ps
```

### دیدن لاگ‌ها (زنده):
```bash
docker compose logs -f
```

### دیدن لاگ یک سرویس خاص:
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Restart کردن:
```bash
docker compose restart
```

### توقف پروژه:
```bash
docker compose down
```

### اجرای مجدد:
```bash
docker compose up -d
```

### Rebuild کردن (بعد از تغییرات):
```bash
docker compose up -d --build
```

---

## 🔥 عیب‌یابی مشکلات رایج

### ❌ خطا: "cannot connect to server"

**راه‌حل:**
```bash
# چک کردن SSH config
cat ~/.ssh/config

# تست اتصال
ssh talaseencom

# اگه خطا داد، چک کنید:
ls -la ~/.ssh/id_ed25519_talaseencom
```

### ❌ خطا: ".env file not found"

**راه‌حل:**
```bash
ssh talaseencom
cd /home/yousef/talaseen

# کپی از فایل نمونه
cp .env.production .env

# ویرایش
nano .env

# اجرای مجدد
./server-setup.sh
```

### ❌ خطا: "Docker daemon not running"

**راه‌حل:**
```bash
ssh talaseencom
sudo systemctl start docker
sudo systemctl enable docker
```

### ❌ خطا: "Permission denied"

**راه‌حل:**
```bash
ssh talaseencom
sudo usermod -aG docker $USER
# خروج و ورود مجدد
exit
ssh talaseencom
```

### ❌ پورت در حال استفاده است

**راه‌حل:**
```bash
# پیدا کردن process که پورت رو گرفته
sudo lsof -i :4000
sudo lsof -i :3002

# Kill کردن process
sudo kill -9 <PID>

# یا تغییر پورت در docker-compose.yml
```

### ❌ Frontend نمایش داده نمیشه

**راه‌حل:**
```bash
# چک کردن لاگ‌های frontend
docker compose logs frontend

# Rebuild کردن frontend
docker compose up -d --build frontend
```

### ❌ Backend خطای دیتابیس میده

**راه‌حل:**
```bash
# چک کردن دیتابیس
docker compose ps
docker compose logs postgres

# اگه دیتابیس مشکل داره
docker compose down
docker volume rm talaseen_postgres_data
docker compose up -d
```

---

## 🔐 نکات امنیتی

1. **حتماً پسوردها رو تغییر بدید** - پسورد پیش‌فرض استفاده نکنید

2. **فایل `.env` رو در گیت نذارید** - قبلاً در `.gitignore` اضافه شده

3. **Firewall رو تنظیم کنید:**
```bash
# فقط پورت‌های لازم رو باز کنید
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 3002/tcp    # Frontend
sudo ufw allow 4000/tcp    # Backend
sudo ufw enable
```

4. **از HTTPS استفاده کنید** - با Nginx و Let's Encrypt

---

## 📦 آپدیت کردن پروژه

وقتی تغییرات جدید دادید:

### از کامپیوتر محلی:
```bash
cd /home/sajad/talaseen
./deploy.sh
```

این همه چیز رو از اول انجام میده.

### یا روی سرور:
```bash
ssh talaseencom
cd /home/yousef/talaseen

# Pull کردن تغییرات (اگه از Git استفاده می‌کنید)
git pull

# Rebuild
docker compose up -d --build
```

---

## 🌐 لینک‌ها

- Frontend: http://185.255.91.45:3002
- Backend: http://185.255.91.45:4000
- API Docs: http://185.255.91.45:4000/api

---

## 📞 کمک بیشتر

اگه مشکلی داشتید:

1. لاگ‌ها رو چک کنید:
```bash
ssh talaseencom 'cd /home/yousef/talaseen && docker compose logs'
```

2. وضعیت containerها:
```bash
ssh talaseencom 'cd /home/yousef/talaseen && docker compose ps'
```

3. فضای دیسک:
```bash
ssh talaseencom 'df -h'
```

4. حافظه:
```bash
ssh talaseencom 'free -h'
```
