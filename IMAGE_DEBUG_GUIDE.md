# راهنمای حل مشکل نمایش عکس‌ها

## ✅ کارهای انجام شده:

### 1. تنظیمات Environment Variables

**فایل: `services/frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### 2. تابع getImageUrl بهبود یافته

**فایل: `services/frontend/lib/utils.ts`**
```typescript
export function getImageUrl(path: string): string {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                     process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 
                     'http://localhost:4000';
  return `${backendUrl}${path}`;
}
```

### 3. استفاده از getImageUrl در تمام صفحات

✅ `app/products/[id]/page.tsx` - صفحه جزئیات محصول
✅ `app/dashboard/page.tsx` - داشبورد فروشنده  
✅ `app/admin/page.tsx` - پنل ادمین
✅ `app/search/page.tsx` - نتایج جستجو

## 🔍 دلایل احتمالی عدم نمایش عکس:

### 1. **Backend در حال اجرا نیست**
```bash
# بررسی کنید backend روشن است:
curl http://localhost:4000/api
```

### 2. **پوشه uploads در Docker mount نشده**
```bash
# بررسی docker-compose.yml:
volumes:
  - ./services/backend/uploads:/app/uploads
```

### 3. **عکسی آپلود نشده است**
```bash
# بررسی پوشه uploads:
ls -la services/backend/uploads/products/
```

### 4. **محصول عکس ندارد**
```bash
# از Prisma Studio یا مستقیم از دیتابیس بررسی کنید:
# که محصول حداقل یک عکس در جدول ProductImage دارد
```

### 5. **CORS مشکل دارد**
Backend باید CORS را برای frontend فعال کند (در `main.ts` انجام شده):
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

## 🧪 تست کامل:

### مرحله 1: بررسی Backend
```bash
# آیا backend در حال اجرا است؟
curl http://localhost:4000/api

# آیا static files سرو می‌شوند؟
# (فرض کنید عکسی با نام test.jpg در پوشه products دارید)
curl -I http://localhost:4000/uploads/products/test.jpg
```

### مرحله 2: تست آپلود
```bash
# آپلود یک عکس تست (نیاز به token دارید):
curl -X POST http://localhost:4000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### مرحله 3: بررسی Frontend
1. باز کردن Developer Tools (F12)
2. رفتن به tab Network
3. فیلتر کردن روی "Img"
4. بارگذاری صفحه محصول
5. بررسی درخواست‌های عکس:
   - آیا URL صحیح است؟ (باید `http://localhost:4000/uploads/products/...` باشد)
   - آیا کد وضعیت 200 است؟
   - اگر 404 است، عکس وجود ندارد
   - اگر 403 است، مشکل دسترسی است

### مرحله 4: بررسی Console
در Developer Tools > Console، دنبال خطاهای مربوط به:
- CORS errors
- 404 Not Found
- Network errors

## 🔧 حل مشکلات رایج:

### مشکل 1: عکس‌ها 404 می‌دهند
**علت**: عکس واقعاً در پوشه وجود ندارد
**راه‌حل**: 
```bash
# بررسی محتویات پوشه
ls -la services/backend/uploads/products/

# اگر خالی است، یک عکس تست آپلود کنید
```

### مشکل 2: URL عکس اشتباه است
**علت**: `NEXT_PUBLIC_BACKEND_URL` تنظیم نشده
**راه‌حل**:
```bash
# اضافه کردن به .env.local:
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000" >> services/frontend/.env.local

# Restart frontend:
docker compose restart frontend
# یا اگر local اجرا می‌کنید:
cd services/frontend && npm run dev
```

### مشکل 3: تغییرات تاثیر نداشت
**علت**: Next.js تغییرات env را cache کرده
**راه‌حل**:
```bash
# پاک کردن cache و rebuild:
cd services/frontend
rm -rf .next
npm run dev
```

### مشکل 4: در Docker عکس‌ها نمایش داده نمی‌شوند
**علت**: Volume mapping اشتباه است
**راه‌حل**:
```bash
# توقف containers
docker compose down

# پاک کردن volumes
docker volume prune

# شروع مجدد
docker compose up --build
```

## 📊 دیباگ با Console Logs

اضافه کردن این کد به `lib/utils.ts` برای دیباگ:
```typescript
export function getImageUrl(path: string): string {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                     process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 
                     'http://localhost:4000';
  const fullUrl = `${backendUrl}${path}`;
  
  // Debug log
  console.log('getImageUrl:', { path, backendUrl, fullUrl });
  
  return fullUrl;
}
```

سپس در Browser Console ببینید چه URL هایی generate می‌شوند.

## ✨ بعد از حل مشکل:

1. حذف console.log های اضافی
2. تست کامل آپلود و نمایش عکس
3. Restart کردن همه سرویس‌ها
4. تست در مرورگرهای مختلف

## 📞 اگر باز هم مشکل دارید:

1. لاگ‌های backend را چک کنید:
   ```bash
   docker compose logs backend
   ```

2. لاگ‌های frontend را چک کنید:
   ```bash
   docker compose logs frontend
   ```

3. Network را با curl تست کنید:
   ```bash
   curl -v http://localhost:4000/uploads/products/
   ```
