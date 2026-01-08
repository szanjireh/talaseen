import { Controller, Get, Post, Put, Req, Res, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.login(req.user);
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    

    // Redirect to frontend with token and user data
    const redirectUrl = `${frontendUrl}/auth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
    res.redirect(redirectUrl);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return req.user;
  }

  @Post('request-seller')
  @UseGuards(AuthGuard('jwt'))
  async requestSellerRole(
    @Req() req,
    @Body() data: { shopName: string },
  ) {
    return this.authService.requestSellerRole(req.user.id, data.shopName);
  }

  @Get('my-seller')
  @UseGuards(AuthGuard('jwt'))
  async getMySeller(@Req() req) {
    return this.authService.getUserSeller(req.user.id);
  }

  @Get('admin/pending-sellers')
  @UseGuards(AuthGuard('jwt'))
  async getPendingSellers(@Req() req) {
    return this.authService.getPendingSellers(req.user.id);
  }

  @Get('admin/users')
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers(@Req() req) {
    return this.authService.getAllUsers(req.user.id);
  }

  @Get('admin/admins')
  @UseGuards(AuthGuard('jwt'))
  async getAllAdmins(@Req() req) {
    return this.authService.getAllAdmins(req.user.id);
  }

  @Get('admin/sellers')
  @UseGuards(AuthGuard('jwt'))
  async getAllSellers(@Req() req) {
    return this.authService.getAllSellers(req.user.id);
  }

  @Put('admin/users/:id/promote-to-admin')
  @UseGuards(AuthGuard('jwt'))
  async promoteUserToAdmin(@Req() req, @Param('id') userId: string) {
    return this.authService.promoteUserToAdmin(req.user.id, userId);
  }

  @Put('admin/sellers/:id/approve')
  @UseGuards(AuthGuard('jwt'))
  async approveSeller(@Req() req, @Param('id') id: string) {
    return this.authService.approveSeller(req.user.id, id);
  }

  @Put('admin/sellers/:id/reject')
  @UseGuards(AuthGuard('jwt'))
  async rejectSeller(@Req() req, @Param('id') id: string) {
    return this.authService.rejectSeller(req.user.id, id);
  }

  // ==================== SMS OTP ====================

  @Post('sms/send-otp')
  async sendOtp(@Body() data: { phone: string }) {
    return this.authService.sendOtp(data.phone);
  }

  @Post('sms/verify-otp')
  async verifyOtp(@Body() data: { phone: string; code: string }) {
    return this.authService.verifyOtp(data.phone, data.code);
  }
}
