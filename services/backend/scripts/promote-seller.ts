import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToSeller(email: string, shopName?: string) {
  try {
    console.log(`Looking for user with email: ${email}`);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { seller: true },
    });

    if (!user) {
      console.error('❌ کاربر با این ایمیل پیدا نشد');
      return;
    }

    console.log(`✅ کاربر پیدا شد: ${user.name} (${user.email})`);
    console.log(`   نقش فعلی: ${user.role}`);

    // Check if already has seller profile
    if (user.seller) {
      console.log(`⚠️  پروفایل فروشنده از قبل وجود دارد`);
      console.log(`   نام فروشگاه: ${user.seller.shopName}`);
      console.log(`   وضعیت: ${user.seller.isApproved ? 'تایید شده ✅' : 'تایید نشده ❌'}`);
      
      if (!user.seller.isApproved) {
        console.log(`\n🔄 در حال تایید پروفایل فروشنده...`);
        await prisma.seller.update({
          where: { id: user.seller.id },
          data: { isApproved: true },
        });
        console.log(`✅ پروفایل فروشنده تایید شد!`);
      }

      // Update role to SELLER if not already (but keep ADMIN if they are ADMIN)
      if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'SELLER' },
        });
        console.log(`✅ نقش کاربر به SELLER تغییر یافت`);
      } else if (user.role === 'ADMIN') {
        console.log(`ℹ️  کاربر ADMIN است، نقش تغییر نکرد`);
      }

      return;
    }

    // Create seller profile
    const sellerShopName = shopName || `${user.name}'s Shop`;
    
    console.log(`\n🔄 در حال ایجاد پروفایل فروشنده...`);
    
    await prisma.seller.create({
      data: {
        userId: user.id,
        shopName: sellerShopName,
        isApproved: true,
      },
    });

    // Update user role to SELLER (unless they're already ADMIN)
    if (user.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'SELLER' },
      });
      console.log(`✅ نقش کاربر به SELLER تغییر یافت`);
    } else {
      console.log(`ℹ️  کاربر ADMIN است، نقش حفظ شد`);
    }

    console.log(`✅ پروفایل فروشنده ایجاد شد!`);
    console.log(`   نام فروشگاه: ${sellerShopName}`);
    console.log(`   وضعیت: تایید شده ✅`);
    console.log(`   نقش کاربر: SELLER`);
    console.log(`\n🎉 کاربر ${user.name} اکنون می‌تواند محصول اضافه کند!`);

  } catch (error) {
    console.error('❌ خطا در تبدیل به فروشنده:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];
const shopName = process.argv[3];

if (!email) {
  console.error('❌ لطفاً ایمیل کاربر را وارد کنید:');
  console.log('استفاده: npm run promote-seller user@example.com "نام فروشگاه"');
  process.exit(1);
}

promoteToSeller(email, shopName);
