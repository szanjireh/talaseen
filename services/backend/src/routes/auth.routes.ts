import { Router, Request, Response } from 'express';
import { AppDataSource } from '../datasource';
import { User, UserRole } from '../models/User';
import bcrypt from 'bcrypt';
import { JwtService } from '../utils/jwt';
import { body, validationResult } from 'express-validator';
import { AuthRequest, authenticate } from '../middleware/auth.middleware';

const router = Router();

// Register
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role, shopName, shopDescription } = req.body;
      
      const userRepo = AppDataSource.getRepository(User);
      
      const existingUser = await userRepo.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = userRepo.create({
        email,
        password: hashedPassword,
        name,
        role: role === 'vendor' ? UserRole.VENDOR : UserRole.CUSTOMER,
        shopName: role === 'vendor' ? shopName : undefined,
        shopDescription: role === 'vendor' ? shopDescription : undefined
      });

      await userRepo.save(user);

      const tokens = JwtService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          shopName: user.shopName
        },
        ...tokens
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { email } });
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const tokens = JwtService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          shopName: user.shopName
        },
        ...tokens
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: req.user!.userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      shopName: user.shopName,
      shopDescription: user.shopDescription,
      shopLogo: user.shopLogo
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
