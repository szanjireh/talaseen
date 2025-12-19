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
    const { type, minPrice, maxPrice, search, page = 1, limit = 24 } = filters || {};
    
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

    return this.prisma.goldProduct.create({
      data: { ...data, sellerId: seller.id },
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
}
