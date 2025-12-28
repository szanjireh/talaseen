import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMoreProducts() {
  try {
    // Find a seller
    const seller = await prisma.seller.findFirst({
      where: { isApproved: true }
    });

    if (!seller) {
      console.log('❌ هیچ فروشنده تایید شده‌ای یافت نشد');
      return;
    }

    console.log(`✅ فروشنده پیدا شد: ${seller.shopName}`);

    const products = [
      {
        title: 'انگشتر طلای سولیتر',
        description: 'انگشتر زیبای طلا با نگین سولیتر',
        type: 'RING',
        weight: 3.5,
        makingFee: 15,
        profitPercent: 8,
        goldPriceAtCreation: 5000000,
        finalPrice: 25000000,
      },
      {
        title: 'انگشتر حلقه ساده',
        description: 'انگشتر ساده و شیک',
        type: 'RING',
        weight: 2.8,
        makingFee: 12,
        profitPercent: 7,
        goldPriceAtCreation: 5000000,
        finalPrice: 18000000,
      },
      {
        title: 'گردنبند گلدار',
        description: 'گردنبند طلا با طرح گل',
        type: 'NECKLACE',
        weight: 4.2,
        makingFee: 18,
        profitPercent: 9,
        goldPriceAtCreation: 5000000,
        finalPrice: 32000000,
      },
      {
        title: 'گردنبند زنجیری',
        description: 'گردنبند زنجیری ظریف',
        type: 'NECKLACE',
        weight: 3.0,
        makingFee: 14,
        profitPercent: 8,
        goldPriceAtCreation: 5000000,
        finalPrice: 22000000,
      },
      {
        title: 'دستبند کارتیه',
        description: 'دستبند طلا با طرح کارتیه',
        type: 'BRACELET',
        weight: 5.5,
        makingFee: 20,
        profitPercent: 10,
        goldPriceAtCreation: 5000000,
        finalPrice: 42000000,
      },
      {
        title: 'دستبند حلقه‌ای',
        description: 'دستبند حلقه‌ای شیک',
        type: 'BRACELET',
        weight: 4.8,
        makingFee: 17,
        profitPercent: 9,
        goldPriceAtCreation: 5000000,
        finalPrice: 36000000,
      },
      {
        title: 'گوشواره میخی',
        description: 'گوشواره میخی با نگین',
        type: 'EARRING',
        weight: 1.5,
        makingFee: 10,
        profitPercent: 6,
        goldPriceAtCreation: 5000000,
        finalPrice: 12000000,
      },
      {
        title: 'گوشواره آویز',
        description: 'گوشواره آویزی بلند',
        type: 'EARRING',
        weight: 2.2,
        makingFee: 13,
        profitPercent: 7,
        goldPriceAtCreation: 5000000,
        finalPrice: 16000000,
      },
      {
        title: 'زنجیر کارتیر',
        description: 'زنجیر گردن طلا',
        type: 'CHAIN',
        weight: 6.0,
        makingFee: 16,
        profitPercent: 8,
        goldPriceAtCreation: 5000000,
        finalPrice: 45000000,
      },
      {
        title: 'پابند ظریف',
        description: 'پابند طلا با زنگوله',
        type: 'ANKLET',
        weight: 2.5,
        makingFee: 12,
        profitPercent: 7,
        goldPriceAtCreation: 5000000,
        finalPrice: 19000000,
      },
    ];

    for (const product of products) {
      await prisma.goldProduct.create({
        data: {
          title: product.title,
          description: product.description,
          type: product.type as any,
          weight: product.weight,
          makingFee: product.makingFee,
          profitPercent: product.profitPercent,
          goldPriceAtCreation: product.goldPriceAtCreation,
          finalPrice: product.finalPrice,
          seller: {
            connect: { id: seller.id }
          }
        },
      });
      console.log(`✅ محصول اضافه شد: ${product.title}`);
    }

    console.log('\n✅ همه محصولات با موفقیت اضافه شدند!');
  } catch (error) {
    console.error('❌ خطا:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMoreProducts();
