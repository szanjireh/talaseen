import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
}
