import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './types/authenticated-request.type';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _dto: LoginDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // user is attached by LocalStrategy
    const user: any = (req as any).user;
    return this.authService.login(user._id.toString(), user.email, user.roles ?? []);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async me(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.createPasswordResetToken(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Redirect handled by passport
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const { accessToken } = await this.authService.login(
      user._id.toString(),
      user.email,
      user.roles ?? [],
    );
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/social-callback?token=${encodeURIComponent(
      accessToken,
    )}`;
    return res.redirect(redirectUrl);
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const { accessToken } = await this.authService.login(
      user._id.toString(),
      user.email,
      user.roles ?? [],
    );
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/social-callback?token=${encodeURIComponent(
      accessToken,
    )}`;
    return res.redirect(redirectUrl);
  }

  // LinkedIn OAuth
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {}

  @Get('linkedin/redirect')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const { accessToken } = await this.authService.login(
      user._id.toString(),
      user.email,
      user.roles ?? [],
    );
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/social-callback?token=${encodeURIComponent(
      accessToken,
    )}`;
    return res.redirect(redirectUrl);
  }
}
