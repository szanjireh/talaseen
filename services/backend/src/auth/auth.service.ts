import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { SmsService } from './sms.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {}

  async validateGoogleUser(profile: any) {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;

    // Try to find by googleId first, then fall back to email
    let user = await this.prisma.user.findUnique({ where: { googleId: id } });

    if (!user) {
      // If there's a user with the same email (created manually), attach googleId to avoid unique email error
      user = await this.prisma.user.findUnique({ where: { email } });
    }

    if (user) {
      // Ensure googleId and latest profile info are set
      if (!user.googleId || user.googleId !== id || user.name !== displayName || user.avatar !== photos?.[0]?.value) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: id,
            name: displayName,
            avatar: photos?.[0]?.value,
          },
        });
      }
    } else {
      // Create new user with USER role by default
      user = await this.prisma.user.create({
        data: {
          email,
          name: displayName,
          googleId: id,
          avatar: photos?.[0]?.value,
          role: UserRole.USER, // Everyone starts as USER
        },
      });
    }

    return user;
  }

  async login(user: any) {
    // Fetch seller info if user has a seller profile (can be ADMIN or SELLER)
    const seller = await this.prisma.seller.findUnique({ 
      where: { userId: user.id } 
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        shopName: seller?.shopName,
        isApproved: seller?.isApproved,
      },
    };
  }

  async requestSellerRole(userId: string, shopName: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      include: { seller: true }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if seller profile already exists
    if (user.seller) {
      throw new ForbiddenException('Seller profile already exists');
    }

    // Create seller profile (unapproved)
    const seller = await this.prisma.seller.create({
      data: {
        userId,
        shopName,
        isApproved: false,
      },
    });

    // Update user role to SELLER only if not ADMIN
    if (user.role !== UserRole.ADMIN) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.SELLER },
      });
    }

    return seller;
  }

  async getPendingSellers(adminUserId: string) {
    // Verify admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can view pending sellers');
    }

    return this.prisma.seller.findMany({
      where: { isApproved: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllUsers(adminUserId: string) {
    // Verify admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can view users');
    }

    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  async getAllAdmins(adminUserId: string) {
    // Verify admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can view admins');
    }

    const admins = await this.prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return admins;
  }

  async getAllSellers(adminUserId: string) {
    // Verify admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can view sellers');
    }

    const sellers = await this.prisma.seller.findMany({
      where: {
        isApproved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        _count: {
          select: {
            goldProducts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sellers;
  }

  async promoteUserToAdmin(adminUserId: string, userId: string) {
    // Verify admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can promote users');
    }

    // Get target user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already admin
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('User is already an admin');
    }

    // Promote to admin
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.ADMIN },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  async approveSeller(adminUserId: string, sellerId: string) {
    // Verify admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can approve sellers');
    }

    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.isApproved) {
      throw new ForbiddenException('Seller is already approved');
    }

    return this.prisma.seller.update({
      where: { id: sellerId },
      data: { isApproved: true },
    });
  }

  async rejectSeller(adminUserId: string, sellerId: string) {
    // Verify admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can reject sellers');
    }

    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      include: { user: true },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Delete seller and revert user role to USER (only if not ADMIN)
    await this.prisma.$transaction([
      this.prisma.seller.delete({ where: { id: sellerId } }),
      ...(seller.user.role !== UserRole.ADMIN ? [
        this.prisma.user.update({
          where: { id: seller.userId },
          data: { role: UserRole.USER },
        })
      ] : []),
    ]);

    return { message: 'Seller rejected successfully' };
  }

  async getUserSeller(userId: string) {
    return this.prisma.seller.findUnique({
      where: { userId },
    });
  }

  // ==================== SMS OTP AUTHENTICATION ====================

  async sendOtp(phone: string) {
    // Validate and normalize phone number
    const normalizedPhone = this.smsService.normalizePhoneNumber(phone);
    
    if (!this.smsService.validatePhoneNumber(normalizedPhone)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Generate OTP code
    const code = this.smsService.generateOtpCode();
    
    // Set expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete any existing OTP for this phone
    await this.prisma.otpCode.deleteMany({
      where: { phone: normalizedPhone },
    });

    // Save OTP to database
    await this.prisma.otpCode.create({
      data: {
        phone: normalizedPhone,
        code,
        expiresAt,
      },
    });

    // Send SMS
    const sent = await this.smsService.sendOtp(normalizedPhone, code);
    
    if (!sent) {
      throw new BadRequestException('Failed to send SMS');
    }

    return {
      message: 'کد تایید به شماره موبایل شما ارسال شد',
      expiresIn: 300, // 5 minutes in seconds
    };
  }

  async verifyOtp(phone: string, code: string) {
    const normalizedPhone = this.smsService.normalizePhoneNumber(phone);

    // Find OTP record
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        phone: normalizedPhone,
        code,
        verified: false,
        expiresAt: {
          gte: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('کد تایید نامعتبر یا منقضی شده است');
    }

    // Mark OTP as verified
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      // Create new user with phone number
      user = await this.prisma.user.create({
        data: {
          phone: normalizedPhone,
          name: `کاربر ${normalizedPhone.slice(-4)}`, // Last 4 digits as default name
          role: UserRole.USER,
        },
      });
    }

    // Link OTP to user
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { userId: user.id },
    });

    // Generate JWT and return user info
    return this.login(user);
  }
}
