import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthProvider, User } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
      roles: ['user'],
      provider: AuthProvider.LOCAL,
    } as Partial<User>);

    return this.buildAuthResponse(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  buildAuthResponse(user: any) {
    const { _id, email, roles, name } = user;
    const payload = { sub: _id.toString(), email, roles };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: _id,
        email,
        name,
        roles,
      },
    };
  }

  async createPasswordResetToken(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      // To avoid leaking which emails exist, respond as if it worked.
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // Placeholder: plug in real email service here
    // e.g. sendEmail(user.email, buildResetUrl(token));
    // For now, just return the token so you can test easily.
    return {
      message: 'Reset token generated (in real app, email it to user).',
      token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const now = new Date();
    const user = await this.usersService.model.findOne({
      resetPasswordToken: dto.token,
      resetPasswordExpires: { $gt: now },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }
}

