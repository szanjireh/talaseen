# 🔐 مدیریت کاربران ادمین - Talaseen

## ✅ کاربر ادمین اصلی

**ایمیل:** s.zanjireh@gmail.com  
**نام:** سجاد زنجیره  
**نقش:** ADMIN  
**دسترسی‌ها:** تمام دسترسی‌ها ✅

---

## 📋 دسترسی‌های ادمین

### ✅ دسترسی‌های کامل:

1. **مدیریت کاربران**
   - مشاهده تمام کاربران
   - تغییر نقش کاربران (USER, SELLER, ADMIN)
   - حذف کاربران

2. **مدیریت فروشندگان**
   - مشاهده درخواست‌های فروشندگی
   - تایید یا رد درخواست‌ها
   - مدیریت فروشگاه‌ها

3. **مدیریت محصولات**
   - مشاهده تمام محصولات
   - ویرایش هر محصولی
   - حذف محصولات
   - ایجاد محصول جدید

4. **مدیریت اعلانات**
   - ایجاد اعلان
   - ویرایش اعلان
   - حذف اعلان
   - فعال/غیرفعال کردن

5. **دسترسی به پنل ادمین**
   - `/admin` - پنل مدیریت
   - `/admin/sellers` - مدیریت فروشندگان
   - `/admin/products` - مدیریت محصولات
   - `/admin/announcements` - مدیریت اعلانات

---

## 🛠️ دستورات مدیریت ادمین

### ایجاد یا ارتقای کاربر به ادمین:

```bash
# از طریق Docker
docker compose exec backend npm run setup-admin EMAIL "NAME"

# مثال
docker compose exec backend npm run setup-admin admin@example.com "Admin Name"
```

### ارتقای کاربر موجود به ادمین:

```bash
docker compose exec backend npm run promote-admin EMAIL

# مثال
docker compose exec backend npm run promote-admin user@example.com
```

### بررسی لیست ادمین‌ها:

```bash
docker compose exec postgres psql -U talaseen -d talaseen -c \
  "SELECT id, name, email, role, \"createdAt\" FROM \"User\" WHERE role = 'ADMIN';"
```

### بررسی اطلاعات کاربر خاص:

```bash
docker compose exec postgres psql -U talaseen -d talaseen -c \
  "SELECT * FROM \"User\" WHERE email = 's.zanjireh@gmail.com';"
```

---

## 📊 نقش‌های کاربری

| نقش | توضیحات | دسترسی‌ها |
|-----|---------|----------|
| **ADMIN** | مدیر کل | تمام دسترسی‌ها |
| **SELLER** | فروشنده | مدیریت محصولات خود |
| **USER** | کاربر عادی | مشاهده و لایک محصولات |

---

## 🔄 تغییر نقش کاربر

### از طریق SQL:

```sql
-- تبدیل به ADMIN
UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';

-- تبدیل به SELLER
UPDATE "User" SET role = 'SELLER' WHERE email = 'user@example.com';

-- تبدیل به USER
UPDATE "User" SET role = 'USER' WHERE email = 'user@example.com';
```

### از طریق اسکریپت:

```bash
# تبدیل به ADMIN
docker compose exec backend npm run setup-admin EMAIL

# تبدیل به SELLER (همراه با ایجاد فروشگاه)
docker compose exec backend npm run promote-seller EMAIL "SHOP_NAME"
```

---

## 🔒 امنیت

### Guards مورد استفاده:

1. **AuthGuard('jwt')** - احراز هویت با JWT
2. **RolesGuard** - بررسی نقش کاربر
3. **@Roles('ADMIN')** - محدود کردن به ادمین

### مثال استفاده در Controller:

```typescript
@Get('admin/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
async getAllUsers() {
  // فقط ادمین دسترسی دارد
}
```

---

## 📝 لاگ‌های مفید

### بررسی لاگ‌های backend:

```bash
docker compose logs backend --tail 50 -f
```

### بررسی فعالیت‌های ادمین:

```bash
# مشاهده تمام کاربران ADMIN
docker compose exec postgres psql -U talaseen -d talaseen -c \
  "SELECT u.id, u.name, u.email, u.role, u.\"createdAt\", 
   COUNT(DISTINCT gp.id) as total_products 
   FROM \"User\" u 
   LEFT JOIN \"Seller\" s ON u.id = s.\"userId\" 
   LEFT JOIN \"GoldProduct\" gp ON s.id = gp.\"sellerId\" 
   WHERE u.role = 'ADMIN' 
   GROUP BY u.id;"
```

---

## 🚀 راه‌اندازی اولیه برای ادمین

1. **ورود به سیستم:**
   - به آدرس: http://localhost:3002
   - کلیک روی "ورود با Google"
   - وارد شوید با ایمیل: s.zanjireh@gmail.com

2. **دسترسی به پنل ادمین:**
   - پس از ورود، به: http://localhost:3002/admin

3. **مدیریت فروشندگان:**
   - تایید یا رد درخواست‌های فروشندگی
   - مشاهده لیست فروشندگان

4. **مدیریت محصولات:**
   - مشاهده، ویرایش یا حذف محصولات
   - ایجاد محصول جدید (اگر فروشنده هم هستید)

---

## ⚡ دستورات سریع

```bash
# چک کردن ادمین‌ها
docker compose exec postgres psql -U talaseen -d talaseen \
  -c "SELECT email, role FROM \"User\" WHERE role = 'ADMIN';"

# تعداد کاربران به تفکیک نقش
docker compose exec postgres psql -U talaseen -d talaseen \
  -c "SELECT role, COUNT(*) FROM \"User\" GROUP BY role;"

# آخرین کاربران ثبت شده
docker compose exec postgres psql -U talaseen -d talaseen \
  -c "SELECT name, email, role, \"createdAt\" FROM \"User\" 
      ORDER BY \"createdAt\" DESC LIMIT 10;"
```

---

## 🎯 خلاصه

- ✅ کاربر **s.zanjireh@gmail.com** ادمین اصلی است
- ✅ دسترسی کامل به تمام بخش‌ها دارد
- ✅ می‌تواند کاربران دیگر را مدیریت کند
- ✅ می‌تواند فروشندگان را تایید/رد کند
- ✅ می‌تواند محصولات را مدیریت کند

**برای هرگونه سوال یا مشکل، لاگ‌های backend را بررسی کنید.**
