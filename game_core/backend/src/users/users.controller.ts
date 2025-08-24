import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { Request } from 'express';

// NOTE: For demo purposes, this reads a mocked user id from request.
// Replace with JWT auth guard later.

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.users.getMe(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/settings')
  getSettings(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.users.getSettings(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/settings')
  updateSettings(
    @Req() req: Request & { user: { sub: string } },
    @Body()
    body: Partial<{ language?: string; theme?: 'light' | 'dark' | 'system' }>,
  ) {
    const userId = req.user.sub;
    return this.users.updateSettings(userId, body);
  }
}
