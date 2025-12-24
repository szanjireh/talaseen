import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

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
    
    if (!query || query.trim() === '') {
      return this.findAll({ page, limit, minPrice, maxPrice, minWeight, maxWeight, maxProfitPercent, maxMakingFee });
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
          } 
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goldProduct.count({ where }),
    ]);

    return {
      products,
      query: searchTerm,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findAll(filters?: any) {
    const { type, minPrice, maxPrice, search, page = 1, limit = 24, userId } = filters || {};
    
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
          _count: {
            select: { likes: true }
          },
          likes: userId ? {
            where: { userId },
            select: { id: true }
          } : false
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goldProduct.count({ where }),
    ]);

    // Transform products to include likesCount and isLiked
    const transformedProducts = products.map(product => ({
      ...product,
      likesCount: product._count.likes,
      isLiked: userId ? (product.likes && product.likes.length > 0) : false,
      _count: undefined,
      likes: undefined,
    }));

    return {
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.goldProduct.findUnique({
      where: { id },
      include: { 
        images: { orderBy: { isPrimary: 'desc' } },
        seller: { 
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } }
          }
        } 
      },
    });
  }

  async create(data: any, userId: string) {
    // Find seller profile for this user
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new Error('Seller profile not found');
    }

    if (!seller.isApproved) {
      throw new Error('Seller must be approved before creating products');
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
    return this.prisma.goldProduct.findMany({
      where: { sellerId },
      include: { images: { orderBy: { isPrimary: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
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
      return { message: 'Product already liked', likesCount: await this.getLikesCount(productId) };
    }

    // Create like
    await this.prisma.like.create({
      data: {
        userId,
        productId,
      },
    });

    return {
      message: 'Product liked successfully',
      likesCount: await this.getLikesCount(productId),
    };
  }

  async unlikeProduct(productId: string, userId: string) {
    try {
      await this.prisma.like.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return {
        message: 'Product unliked successfully',
        likesCount: await this.getLikesCount(productId),
      };
    } catch (error) {
      return { message: 'Like not found', likesCount: await this.getLikesCount(productId) };
    }
  }

  async getProductLikes(productId: string) {
    const likesCount = await this.getLikesCount(productId);
    return { productId, likesCount };
  }

  private async getLikesCount(productId: string): Promise<number> {
    return this.prisma.like.count({
      where: { productId },
    });
  }
}
