import { Injectable,UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { seller: true },
    });
    
    // Format user with seller info for consistency with login response
if (!user) {
  throw new UnauthorizedException('User not found');
}
return {
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  avatar: user.avatar,

  // seller ممکنه null باشه
  shopName: user.seller ? user.seller.shopName : null,
  isApproved: user.seller ? user.seller.isApproved : null,
};

  
  }
}
