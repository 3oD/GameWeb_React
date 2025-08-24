import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

type JwtPayload = { sub: string; email: string; roles?: string[] };

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  validateUser(email: string, password: string) {
    const user = this.users.findByEmail(email);
    // Demo only: accept any non-empty password for the demo user
    if (!user || !password) return null;
    const { id, email: em, displayName, avatarUrl, roles, settings } = user;
    return { id, email: em, displayName, avatarUrl, roles, settings };
  }

  async login(email: string, password: string) {
    const user = this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken, user };
  }

  me(userId: string) {
    return this.users.getMe(userId);
  }
}
