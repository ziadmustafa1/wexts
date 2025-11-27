# Changelog

All notable changes to WEXTS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-01-27

### 🎉 Major Release - Unified Runtime

This is a complete rewrite of WEXTS with a revolutionary unified runtime approach!

### ✨ Added

- **Unified Server Architecture**
  - Single Node.js process runs both Next.js and NestJS
  - Smart routing middleware separates `/api` and frontend routes
  - Zero configuration needed

- **Type-Safe SDK System**
  - Auto-generated SDK with zero URLs
  - Works in Server Actions, Server Components, and Client Components
  - Full TypeScript type safety end-to-end

- **Complete Authentication**
  - JWT-based authentication out of the box
  - Secure httpOnly cookies
  - Protected routes with guards
  - Login, Register, Logout flows

- **Deployment Ready**
  - Docker multi-stage build
  - Docker Compose with PostgreSQL
  - Railway configuration (nixpacks.toml)
  - Render/Heroku support (Procfile)
  - Vercel serverless support

- **Database Integration**
  - Prisma ORM pre-configured
  - SQLite for development
  - PostgreSQL for production
  - Auto-migration support

- **Developer Experience**
  - Hot reload for both frontend and backend
  - Single `pnpm run dev` command
  - Comprehensive error messages
  - Built-in examples (Auth, CRUD)

### 🔧 Technical Improvements

- Upgraded to Next.js 16
- Upgraded to NestJS 11
- TypeScript 5.3+ support
- Modern React 19 compatibility
- ESM + CommonJS dual package

### 📚 Documentation

- Complete README with examples
- Architecture documentation
- Deployment guides (Docker, Railway, Render)
- API reference
- Contributing guidelines

### 🐛 Fixed

- Dependency injection issues in NestJS modules
- CORS configuration
- Environment variable handling
- Build process optimization

### 🔄 Changed

- **BREAKING**: Complete API redesign
- **BREAKING**: New project structure
- **BREAKING**: Removed old proxy-based approach
- Simplified CLI commands
- Improved template system

### 📦 Dependencies

- `@nestjs/common`: ^11.0.0
- `@nestjs/core`: ^11.0.0
- `next`: 16.0.0
- `react`: ^19.0.0
- `typescript`: ^5.3.0

---

## [2.x.x] - Previous Versions

Legacy versions used separate Next.js and NestJS servers with proxy configuration.

See [V2_MODERNIZATION_SUMMARY.md](./V2_MODERNIZATION_SUMMARY.md) for migration details.

---

## How to Upgrade

### From 2.x to 3.x

**Major Breaking Changes:**

1. **Architecture Change**
   - Old: Separate servers with proxy
   - New: Single unified server

2. **API Calls**
   ```typescript
   // Old
   fetch('http://localhost:3001/api/users')
   
   // New
   import { api } from '@/lib/api';
   api.users.findAll()
   ```

3. **Deployment**
   - Old: Deploy Next.js and NestJS separately
   - New: Single deployment with Docker/Railway

**Migration Steps:**

1. Create new project with `npx wexts create my-app`
2. Copy your modules to `apps/api/src`
3. Copy your pages to `apps/web/app`
4. Update API calls to use SDK
5. Configure environment variables
6. Test and deploy!

---

## Roadmap

### Upcoming Features

- [ ] Auto-generate SDK from NestJS controllers
- [ ] GraphQL support
- [ ] WebSocket integration
- [ ] Multi-database support
- [ ] CLI improvements
- [ ] Testing utilities
- [ ] Performance monitoring
- [ ] Admin dashboard

---

**Questions?** [Open an issue](https://github.com/ziadmustafa1/wexts/issues)
