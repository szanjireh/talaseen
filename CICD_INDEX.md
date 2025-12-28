# 📋 فهرست کامل مستندات CI/CD
# Complete CI/CD Documentation Index

این فایل راهنمای سریع برای دسترسی به تمام مستندات CI/CD پروژه است.

---

## 🚀 شروع سریع

**برای شروع سریع از اینجا شروع کنید:**

👉 **[CICD_QUICK_START.md](CICD_QUICK_START.md)** - راهنمای شروع سریع (فارسی/انگلیسی)

---

## 📚 مستندات کامل

### 1. راهنماهای نصب و راه‌اندازی

| فایل | توضیحات | زبان | سایز |
|------|---------|------|------|
| [CICD_QUICK_START.md](CICD_QUICK_START.md) | راهنمای شروع سریع | 🇮🇷 🇬🇧 | 7.7 KB |
| [CICD_SETUP_GUIDE.md](CICD_SETUP_GUIDE.md) | راهنمای کامل و جامع | 🇮🇷 فارسی | 9.3 KB |
| [CICD_CHECKLIST.md](CICD_CHECKLIST.md) | چک‌لیست گام‌به‌گام | 🇮🇷 فارسی | 6.6 KB |

### 2. راهنماهای تنظیمات

| فایل | توضیحات | زبان | سایز |
|------|---------|------|------|
| [GITHUB_SECRETS.md](GITHUB_SECRETS.md) | راهنمای GitHub Secrets | 🇬🇧 English | 4.6 KB |
| [.env.github.example](.env.github.example) | نمونه متغیرهای محیطی | 🇬🇧 English | 2.9 KB |

### 3. راهنماهای Workflows

| فایل | توضیحات | زبان | سایز |
|------|---------|------|------|
| [.github/workflows/README.md](.github/workflows/README.md) | توضیحات Workflows | 🇬🇧 English | 3.7 KB |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | پایپ‌لاین CI | YAML | 3.4 KB |
| [.github/workflows/cd.yml](.github/workflows/cd.yml) | پایپ‌لاین CD | YAML | 2.4 KB |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | پایپ‌لاین Deploy | YAML | 2.7 KB |

---

## 🛠️ اسکریپت‌ها

### اسکریپت‌های کمکی

| فایل | توضیحات | استفاده |
|------|---------|---------|
| [install-requirements.sh](install-requirements.sh) | نصب خودکار ملزومات | `./install-requirements.sh` |
| [test-ci-local.sh](test-ci-local.sh) | تست محلی CI Pipeline | `./test-ci-local.sh` |

**نکته:** همه اسکریپت‌ها قابل اجرا هستند (`chmod +x` شده‌اند)

---

## 📖 نحوه استفاده بر اساس نیاز

### ❓ من تازه شروع کرده‌ام
👉 ابتدا [CICD_QUICK_START.md](CICD_QUICK_START.md) را بخوانید

### ❓ می‌خواهم راهنمای کامل را ببینم
👉 [CICD_SETUP_GUIDE.md](CICD_SETUP_GUIDE.md) را مطالعه کنید

### ❓ می‌خواهم گام‌به‌گام پیش بروم
👉 [CICD_CHECKLIST.md](CICD_CHECKLIST.md) را دنبال کنید

### ❓ نمی‌دانم چه Secrets هایی نیاز است
👉 [GITHUB_SECRETS.md](GITHUB_SECRETS.md) را ببینید

### ❓ می‌خواهم Workflows را سفارشی کنم
👉 [.github/workflows/README.md](.github/workflows/README.md) را مطالعه کنید

### ❓ می‌خواهم قبل از Push تست کنم
👉 اسکریپت `./test-ci-local.sh` را اجرا کنید

### ❓ نمی‌دانم چه چیزهایی نیاز است نصب شود
👉 اسکریپت `./install-requirements.sh` را اجرا کنید

---

## 🎯 مراحل پیشنهادی برای مبتدیان

```
1. install-requirements.sh
   ↓
2. CICD_QUICK_START.md
   ↓
3. Docker Hub account + repositories
   ↓
4. GITHUB_SECRETS.md
   ↓
5. test-ci-local.sh (optional)
   ↓
6. git push
   ↓
7. GitHub Actions Tab
   ↓
8. ✅ Done!
```

---

## 📊 نمودار ساختار

```
talaseen/
│
├── 📁 .github/workflows/
│   ├── ci.yml              (CI Pipeline)
│   ├── cd.yml              (CD Pipeline)
│   ├── deploy.yml          (Deployment)
│   └── README.md           (Workflows Docs)
│
├── 📄 CICD_QUICK_START.md      (⭐ Start Here!)
├── 📄 CICD_SETUP_GUIDE.md      (Complete Guide)
├── 📄 CICD_CHECKLIST.md        (Step-by-step)
├── 📄 GITHUB_SECRETS.md        (Secrets Guide)
├── 📄 .env.github.example      (Env Template)
│
├── 🔧 install-requirements.sh  (Install Tools)
├── 🔧 test-ci-local.sh         (Test Locally)
│
└── 📄 CICD_INDEX.md            (This File)
```

---

## 🔗 لینک‌های مفید

### مستندات رسمی
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Hub](https://hub.docker.com)
- [Docker Documentation](https://docs.docker.com)

### ابزارهای تست
- [Act - Run GitHub Actions locally](https://github.com/nektos/act)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

### آموزش‌ها
- [GitHub Actions Tutorial](https://www.youtube.com/watch?v=R8_veQiYBjI)
- [Docker Tutorial](https://www.youtube.com/watch?v=fqMOX6JJhGo)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery)

---

## 🆘 نیاز به کمک؟

### مشکلات رایج
1. **خطای Authentication**: [GITHUB_SECRETS.md](GITHUB_SECRETS.md) → بخش Troubleshooting
2. **خطای Build**: [CICD_SETUP_GUIDE.md](CICD_SETUP_GUIDE.md) → بخش عیب‌یابی
3. **خطای Docker**: [test-ci-local.sh](test-ci-local.sh) → تست محلی
4. **خطای SSH**: [GITHUB_SECRETS.md](GITHUB_SECRETS.md) → بخش SSH

### پشتیبانی
- 🐛 GitHub Issues
- 📧 Email: support@example.com
- 💬 Discussions

---

## 📊 آمار فایل‌ها

**تعداد کل فایل‌ها:** 10  
**حجم کل مستندات:** ~37 KB  
**زبان‌ها:** فارسی 🇮🇷 + English 🇬🇧  

**تاریخ آخرین بروزرسانی:** 28 دسامبر 2025  
**نسخه:** 1.0.0

---

## ✅ وضعیت کامل بودن

- ✅ CI Pipeline
- ✅ CD Pipeline  
- ✅ Deploy Pipeline
- ✅ مستندات فارسی کامل
- ✅ مستندات انگلیسی
- ✅ اسکریپت‌های کمکی
- ✅ نمونه فایل‌های .env
- ✅ چک‌لیست‌ها
- ✅ راهنمای عیب‌یابی

---

## 🎉 پایان

همه چیز آماده است! از [CICD_QUICK_START.md](CICD_QUICK_START.md) شروع کنید.

**موفق باشید!** 🚀

---

**نکته:** این فایل index است و نباید ویرایش شود مگر اینکه فایل جدیدی اضافه شود.
