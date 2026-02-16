import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { UsersService } from '../../users/users.service';
import { AuthProvider } from '../../users/schemas/user.schema';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || 'dummy',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'dummy',
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ??
        'http://localhost:3000/auth/facebook/redirect',
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = (profile.emails && profile.emails[0]?.value) || undefined;
    const existing = email ? await this.usersService.findByEmail(email) : null;

    let user = existing;
    if (!user) {
      user = await this.usersService.create({
        email,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
        provider: AuthProvider.FACEBOOK,
        providerId: profile.id,
        roles: ['user'],
      });
    }

    return user;
  }
}

