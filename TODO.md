# TODO

A concise plan for the next iterations. Boxes are targets; tick as you complete.

## Done
- [x] Frontend scaffold (React + Vite + TS), Tailwind v4, shadcn/ui components
- [x] Theme system (system/manual, persistent, no-FOUC)
- [x] Games page fetching from backend; GameFrame uses `/api/games/:id`
- [x] Backend Nest app with `/api` prefix, CORS, health
- [x] Games module: `GET /api/games`, `GET /api/games/:id` (in-memory)
- [x] Users module: `GET /api/users/me`, `GET/PATCH /api/users/me/settings` (in-memory)
- [x] Auth module: `POST /api/auth/login`, `GET /api/auth/me` (JWT); secured users routes
- [x] Frontend auth wiring: AuthProvider, Login (store token), header user/logout, Profile/Settings use token

## Next (priority)
### Auth & Users
- [ ] Replace demo password logic with real hashing (bcrypt) and validation
- [ ] Add refresh tokens (JWT refresh flow):
  - [ ] `POST /api/auth/refresh` issues new access token
  - [ ] Store refresh token securely (httpOnly cookie or DB with rotation)
  - [ ] Implement `POST /api/auth/logout`
- [ ] Add DTOs + validation (class-validator) for login and settings
- [ ] Redirect unauthenticated users from Profile/Settings to Login (frontend route guard)

### Games & Admin
- [ ] Admin endpoint to toggle game activation: `PATCH /api/games/:id { active }`
- [ ] Persist games in a config file or DB (not in-memory)
- [ ] (Optional) Game metadata: icons, categories, ordering

### Frontend UX
- [ ] Global Toaster for errors/success (shadcn)
- [ ] Loading states/spinners on API calls
- [ ] Settings: replace free-text theme with select (system/light/dark) and sync ThemeProvider
- [ ] 404 page and protected routes wrapper

## Infrastructure
- [ ] Configuration module/service (env vars: JWT_SECRET, CORS origins, ports)
- [ ] Persistence: choose DB
  - Option A: MongoDB via `@nestjs/mongoose` (already in deps)
  - Option B: Postgres + Prisma
- [ ] Docker Compose for backend + DB + sample game services
- [ ] Workspace scripts at repo root to start frontend/backend together

## Security
- [ ] Enable Helmet in Nest
- [ ] If using cookies for refresh: consider CSRF protection
- [ ] Enforce CORS allowlist per environment
- [ ] Audit iFrame embedding: ensure sub-services set appropriate `frame-ancestors`
- [ ] Sanitize and validate all inputs (DTOs everywhere)

## Tests
- [ ] Unit tests: AuthService, UsersService, GamesService
- [ ] E2E tests (supertest): login → me → users settings
- [ ] Frontend component tests for Login, Settings, route guards (optional)

## Documentation
- [ ] Update README(s): architecture overview, run instructions, env vars
- [ ] Document how to add a new game (frontend link, backend config, iFrame constraints)

## Nice to have
- [ ] Avatar upload (profile)
- [ ] Role-based UI (admin badge/actions)
- [ ] iFrame postMessage handshake for pause/resume/focus events
- [ ] Metrics/analytics hooks (page views, game launches)

---
Tips:
- Keep public DTOs and responses typed. Export shared types for frontend when useful.
- Prefer small PRs: one feature or endpoint set at a time.