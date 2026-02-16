import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-linkedin-oauth2';
import { UsersService } from '../../users/users.service';
import { AuthProvider } from '../../users/schemas/user.schema';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID || 'dummy',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'dummy',
      callbackURL:
        process.env.LINKEDIN_CALLBACK_URL ??
        'http://localhost:3000/auth/linkedin/redirect',
      scope: ['r_emailaddress', 'r_liteprofile'],
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
        provider: AuthProvider.LINKEDIN,
        providerId: profile.id,
        roles: ['user'],
      });
    }

    return user;
  }
}

