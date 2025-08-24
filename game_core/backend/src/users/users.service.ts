import { Injectable } from '@nestjs/common';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  avatarUrl?: string;
  roles: string[];
  settings: { language?: string; theme?: 'light' | 'dark' | 'system' };
};

const USERS: User[] = [
  {
    id: 'u1',
    email: 'test@example.com',
    passwordHash: '$2a$10$demoHashForTestingPurposes', // placeholder - in production use proper bcrypt hash
    displayName: 'Test User',
    roles: ['user'],
    settings: { language: 'de', theme: 'system' },
  },
];

@Injectable()
export class UsersService {
  findByEmail(email: string) {
    return USERS.find((u) => u.email === email) ?? null;
  }
  findById(id: string) {
    return USERS.find((u) => u.id === id) ?? null;
  }
  getMe(id: string) {
    const u = this.findById(id);
    if (!u) return null;
    const { id: uid, email, displayName, avatarUrl, roles, settings } = u;
    return { id: uid, email, displayName, avatarUrl, roles, settings };
  }
  getSettings(id: string) {
    return this.findById(id)?.settings ?? null;
  }
  updateSettings(id: string, patch: Partial<User['settings']>) {
    const u = this.findById(id);
    if (!u) return null;
    u.settings = { ...u.settings, ...patch };
    return u.settings;
  }
}
