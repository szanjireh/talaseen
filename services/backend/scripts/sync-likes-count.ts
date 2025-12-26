import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncLikesCount() {
  console.log('Starting to sync likes count...');

  try {
    // Get all products
    const products = await prisma.goldProduct.findMany({
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    console.log(`Found ${products.length} products`);

    // Update each product's likesCount
    for (const product of products) {
      const actualCount = product._count.likes;
      
      if (product.likesCount !== actualCount) {
        await prisma.goldProduct.update({
          where: { id: product.id },
          data: { likesCount: actualCount },
        });
        console.log(`Updated product ${product.id}: ${product.likesCount} -> ${actualCount} likes`);
      }
    }

    console.log('✅ Likes count sync completed successfully!');
  } catch (error) {
    console.error('❌ Error syncing likes count:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

syncLikesCount();
