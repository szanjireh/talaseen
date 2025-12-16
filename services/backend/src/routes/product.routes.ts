import { Router, Request, Response } from 'express';
import { AppDataSource } from '../datasource';
import { Product, ProductCategory, GoldPurity } from '../models/Product';
import { AuthRequest, authenticate, authorizeRoles } from '../middleware/auth.middleware';
import { body, validationResult } from 'express-validator';
import { Like } from 'typeorm';

const router = Router();

// Get all products (with filters and search)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      goldPurity, 
      minPrice, 
      maxPrice, 
      search, 
      page = 1, 
      limit = 24,
      featured 
    } = req.query;

    const productRepo = AppDataSource.getRepository(Product);
    const queryBuilder = productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.vendor', 'vendor')
      .where('product.isActive = :isActive', { isActive: true });

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (goldPurity) {
      queryBuilder.andWhere('product.goldPurity = :goldPurity', { goldPurity });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (featured === 'true') {
      queryBuilder.andWhere('product.isFeatured = :isFeatured', { isFeatured: true });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search OR product.tags::text ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip((pageNum - 1) * limitNum)
      .take(limitNum);

    const [products, total] = await queryBuilder.getManyAndCount();

    res.json({
      products: products.map(p => ({
        ...p,
        vendor: {
          id: p.vendor.id,
          name: p.vendor.name,
          shopName: p.vendor.shopName,
          shopLogo: p.vendor.shopLogo
        }
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: { id: req.params.id, isActive: true },
      relations: ['vendor']
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      ...product,
      vendor: {
        id: product.vendor.id,
        name: product.vendor.name,
        shopName: product.vendor.shopName,
        shopLogo: product.vendor.shopLogo,
        shopDescription: product.vendor.shopDescription
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (vendor only)
router.post('/',
  authenticate,
  authorizeRoles('vendor', 'admin'),
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('category').isIn(Object.values(ProductCategory)),
  body('goldPurity').isIn(Object.values(GoldPurity)),
  body('weight').isNumeric(),
  body('price').isNumeric(),
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productRepo = AppDataSource.getRepository(Product);
      const product = productRepo.create({
        ...req.body,
        vendorId: req.user!.userId
      });

      await productRepo.save(product);
      res.status(201).json(product);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update product (vendor only - own products)
router.put('/:id',
  authenticate,
  authorizeRoles('vendor', 'admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({ where: { id: req.params.id } });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.vendorId !== req.user!.userId && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      Object.assign(product, req.body);
      await productRepo.save(product);

      res.json(product);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete product
router.delete('/:id',
  authenticate,
  authorizeRoles('vendor', 'admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({ where: { id: req.params.id } });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.vendorId !== req.user!.userId && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await productRepo.remove(product);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
