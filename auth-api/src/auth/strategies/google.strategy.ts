import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { AuthProvider } from '../../users/schemas/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails?.[0]?.value;
    const existing = email ? await this.usersService.findByEmail(email) : null;

    let user = existing;
    if (!user) {
      user = await this.usersService.create({
        email,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
        provider: AuthProvider.GOOGLE,
        providerId: profile.id,
        roles: ['user'],
      });
    }

    return user;
  }
}

