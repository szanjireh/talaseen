import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private prisma: PrismaService,
  ) {}

  @Get('categories/counts')
  async getCategoryCounts() {
    return this.productsService.getCategoryCounts();
  }

  @Get('search')
  search(@Query('q') query: string, @Query() filters: any, @Req() req) {
    const userId = req.user?.id;
    return this.productsService.search(query, { ...filters, userId });
  }

  @Get()
  findAll(@Query() query: any, @Req() req) {
    // Pass userId if authenticated
    const userId = req.user?.id;
    return this.productsService.findAll({ ...query, userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    return this.productsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SELLER', 'ADMIN')
  async create(@Body() createProductDto: any, @Req() req) {
    try {
      return await this.productsService.create(createProductDto, req.user.id);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SELLER', 'ADMIN')
  async update(@Param('id') id: string, @Body() updateProductDto: any, @Req() req) {
    // Sellers can only update their own products, admins can update any
    if (req.user.role === 'SELLER') {
      const product = await this.productsService.findOne(id);
      const seller = await this.prisma.seller.findUnique({ where: { userId: req.user.id } });
      if (!seller || product.sellerId !== seller.id) {
        throw new ForbiddenException('You can only update your own products');
      }
    }
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SELLER', 'ADMIN')
  async remove(@Param('id') id: string, @Req() req) {
    // Sellers can only delete their own products, admins can delete any
    if (req.user.role === 'SELLER') {
      const product = await this.productsService.findOne(id);
      const seller = await this.prisma.seller.findUnique({ where: { userId: req.user.id } });
      if (!seller || product.sellerId !== seller.id) {
        throw new ForbiddenException('You can only delete your own products');
      }
    }
    return this.productsService.remove(id);
  }

  @Get('my-products')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SELLER', 'ADMIN')
  async getMyProducts(@Req() req) {
    const seller = await this.prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) {
      throw new ForbiddenException('Seller profile not found');
    }
    return this.productsService.findBySeller(seller.id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async likeProduct(@Param('id') productId: string, @Req() req) {
    return this.productsService.likeProduct(productId, req.user.id);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async unlikeProduct(@Param('id') productId: string, @Req() req) {
    return this.productsService.unlikeProduct(productId, req.user.id);
  }

  @Get(':id/likes')
  async getProductLikes(@Param('id') productId: string) {
    return this.productsService.getProductLikes(productId);
  }
}
