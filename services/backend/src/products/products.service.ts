import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getCategoryCounts() {
    const counts = await this.prisma.goldProduct.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
    });

    // Map English types to Persian names
    const typeNames: Record<string, string> = {
      RING: 'انگشتر',
      NECKLACE: 'گردنبند',
      BRACELET: 'دستبند',
      EARRING: 'گوشواره',
      BANGLE: 'النگو',
      PENDANT: 'آویز',
      ANKLET: 'پابند',
      CHAIN: 'زنجیر',
      COIN: 'سکه',
      BAR: 'شمش',
      OTHER: 'سایر',
    };

    return counts.map(item => ({
      type: item.type,
      name: typeNames[item.type] || item.type,
      count: item._count.id,
    }));
  }

  async search(query: string, filters?: any) {
    const { 
      page = 1, 
      limit = 24,
      minPrice,
      maxPrice,
      minWeight,
      maxWeight,
      maxProfitPercent,
      maxMakingFee,
    } = filters || {};
    
    // Parse numeric values
    const parsedPage = parseInt(page as string) || 1;
    const parsedLimit = parseInt(limit as string) || 24;
    
    if (!query || query.trim() === '') {
      return this.findAll({ page: parsedPage, limit: parsedLimit, minPrice, maxPrice, minWeight, maxWeight, maxProfitPercent, maxMakingFee });
    }

    const searchTerm = query.trim();
    
    const where: any = {
      OR: [
        // Search by product title
        { title: { contains: searchTerm, mode: 'insensitive' as const } },
        // Search by product description
        { description: { contains: searchTerm, mode: 'insensitive' as const } },
        // Search by seller shop name
        { seller: { shopName: { contains: searchTerm, mode: 'insensitive' as const } } },
        // Search by seller user name
        { seller: { user: { name: { contains: searchTerm, mode: 'insensitive' as const } } } },
      ],
    };

    // Apply filters
    if (minPrice) where.finalPrice = { ...where.finalPrice, gte: parseFloat(minPrice) };
    if (maxPrice) where.finalPrice = { ...where.finalPrice, lte: parseFloat(maxPrice) };
    if (minWeight) where.weight = { ...where.weight, gte: parseFloat(minWeight) };
    if (maxWeight) where.weight = { ...where.weight, lte: parseFloat(maxWeight) };
    if (maxProfitPercent) where.profitPercent = { lte: parseFloat(maxProfitPercent) };
    if (maxMakingFee) where.makingFee = { lte: parseFloat(maxMakingFee) };

    const [products, total] = await Promise.all([
      this.prisma.goldProduct.findMany({
        where,
        include: { 
          images: { orderBy: { isPrimary: 'desc' } },
          seller: { 
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } }
            }
          },
          likes: filters?.userId ? {
            where: { userId: filters.userId },
            select: { id: true }
          } : false
        },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goldProduct.count({ where }),
    ]);

    // Transform products to include isLiked
    const transformedProducts = products.map(product => ({
      ...product,
      isLiked: filters?.userId ? (product.likes && product.likes.length > 0) : false,
      likes: undefined,
    }));

    return {
      products: transformedProducts,
      query: searchTerm,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit),
      },
    };
  }

  async findAll(filters?: any) {
    const { type, minPrice, maxPrice, search, page = 1, limit = 24, userId } = filters || {};
    
    // Parse numeric values
    const parsedPage = parseInt(page as string) || 1;
    const parsedLimit = parseInt(limit as string) || 24;
    
    const where: any = {};
    
    if (type) where.type = type;
    if (minPrice) where.finalPrice = { ...where.finalPrice, gte: parseFloat(minPrice) };
    if (maxPrice) where.finalPrice = { ...where.finalPrice, lte: parseFloat(maxPrice) };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.goldProduct.findMany({
        where,
        include: { 
          images: { orderBy: { isPrimary: 'desc' } },
          seller: { 
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } }
            }
          },
          likes: userId ? {
            where: { userId },
            select: { id: true }
          } : false
        },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goldProduct.count({ where }),
    ]);

    // Transform products to include isLiked
    const transformedProducts = products.map(product => ({
      ...product,
      isLiked: userId ? (product.likes && product.likes.length > 0) : false,
      likes: undefined,
    }));

    return {
      products: transformedProducts,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const product = await this.prisma.goldProduct.findUnique({
      where: { id },
      include: { 
        images: { orderBy: { isPrimary: 'desc' } },
        seller: { 
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } }
          }
        },
        likes: userId ? {
          where: { userId },
          select: { id: true }
        } : false
      },
    });

    if (!product) return null;

    return {
      ...product,
      isLiked: userId ? (product.likes && product.likes.length > 0) : false,
      likes: undefined,
    };
  }

  async create(data: any, userId: string) {
    // Find seller profile for this user
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new Error('پروفایل فروشنده شما پیدا نشد. لطفاً ابتدا درخواست فروشندگی دهید.');
    }

    if (!seller.isApproved) {
      throw new Error('پروفایل فروشنده شما هنوز تایید نشده است. لطفاً منتظر تایید مدیر بمانید.');
    }

    // Extract images array and prepare nested create
    const { images, ...productData } = data;
    
    return this.prisma.goldProduct.create({
      data: {
        ...productData,
        sellerId: seller.id,
        images: images ? {
          create: images.map((img: any) => ({
            url: img.url,
            isPrimary: img.isPrimary,
          })),
        } : undefined,
      },
      include: {
        images: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.goldProduct.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.goldProduct.delete({
      where: { id },
    });
  }

  async findBySeller(sellerId: string) {
    const products = await this.prisma.goldProduct.findMany({
      where: { sellerId },
      include: { images: { orderBy: { isPrimary: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return { products };
  }

  async likeProduct(productId: string, userId: string) {
    // Check if already liked
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingLike) {
      const product = await this.prisma.goldProduct.findUnique({
        where: { id: productId },
        select: { likesCount: true },
      });
      return { message: 'Product already liked', likesCount: product?.likesCount || 0 };
    }

    // Create like and increment counter in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.like.create({
        data: {
          userId,
          productId,
        },
      });

      const updatedProduct = await tx.goldProduct.update({
        where: { id: productId },
        data: {
          likesCount: { increment: 1 },
        },
        select: { likesCount: true },
      });

      return updatedProduct.likesCount;
    });

    return {
      message: 'Product liked successfully',
      likesCount: result,
    };
  }

  async unlikeProduct(productId: string, userId: string) {
    try {
      // Delete like and decrement counter in a transaction
      const result = await this.prisma.$transaction(async (tx) => {
        await tx.like.delete({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });

        const updatedProduct = await tx.goldProduct.update({
          where: { id: productId },
          data: {
            likesCount: { decrement: 1 },
          },
          select: { likesCount: true },
        });

        return updatedProduct.likesCount;
      });

      return {
        message: 'Product unliked successfully',
        likesCount: result,
      };
    } catch (error) {
      const product = await this.prisma.goldProduct.findUnique({
        where: { id: productId },
        select: { likesCount: true },
      });
      return { message: 'Like not found', likesCount: product?.likesCount || 0 };
    }
  }

  async getProductLikes(productId: string) {
    const product = await this.prisma.goldProduct.findUnique({
      where: { id: productId },
      select: { likesCount: true },
    });
    return { productId, likesCount: product?.likesCount || 0 };
  }

  async getUserLikedProducts(userId: string, filters?: any) {
    const { page = 1, limit = 24 } = filters || {};
    const parsedPage = parseInt(page as string) || 1;
    const parsedLimit = parseInt(limit as string) || 24;

    const [products, total] = await Promise.all([
      this.prisma.like.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              images: { orderBy: { isPrimary: 'desc' } },
              seller: {
                include: {
                  user: { select: { id: true, name: true, email: true, avatar: true } }
                }
              }
            }
          }
        },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.like.count({ where: { userId } })
    ]);

    return {
      products: products.map(like => ({
        ...like.product,
        isLiked: true
      })),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit)
      }
    };
  }
}
