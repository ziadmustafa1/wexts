<div align="center">

```
██╗    ██╗███████╗██╗  ██╗████████╗███████╗
██║    ██║██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝
██║ █╗ ██║█████╗   ╚███╔╝    ██║   ███████╗
██║███╗██║██╔══╝   ██╔██╗    ██║   ╚════██║
╚███╔███╔╝███████╗██╔╝ ██╗   ██║   ███████║
 ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

<h1>WEXTS Framework</h1>

**The Modern Full-Stack TypeScript Framework**

*Build production-ready apps with Next.js 16 + NestJS 11 in a single unified runtime*

[![npm version](https://img.shields.io/npm/v/wexts.svg)](https://www.npmjs.com/package/wexts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

[Documentation](./docs) • [Examples](./demo) • [Templates](./packages/templates)

</div>

---

## ✨ Why WEXTS?

**Traditional Approach** 😓
```
Next.js (port 3000) ──proxy──> NestJS (port 3001)
   ❌ Two servers
   ❌ CORS configuration
   ❌複雑な deployment
   ❌ URL management hell
```

**WEXTS Approach** 🚀
```
Single Unified Server (port 3000)
   ✅ One Node.js process
   ✅ Smart routing
   ✅ Zero configuration
   ✅ No URLs in code!
```

---

## 🎯 Key Features

<table>
<tr>
<td width="50%">

### 🔥 Unified Runtime
Run Next.js and NestJS in a **single Node.js process** with intelligent routing

### 🎨 Zero URLs
Type-safe API calls **without explicit URLs**
```typescript
// No more this:
fetch('http://localhost:3001/api/users')

// Just this:
api.users.findAll()
```

</td>
<td width="50%">

### ⚡ Developer Experience
- Hot reload for both frontend and backend
- Single `pnpm run dev` command
- Automatic type safety
- No proxy configuration

### 🐳 Production Ready
- One Docker container
- Single deployment
- Works on Vercel, Railway, Render
- PostgreSQL ready

</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
# Create new project
npx wexts create my-app
cd my-app

# Install dependencies
pnpm install

# Start development
pnpm run dev
```

**That's it!** Open http://localhost:3000

✅ Frontend on all routes (except `/api/*`)  
✅ Backend API on `/api/*`  
✅ Zero configuration needed!

---

## 📖 Project Structure

```
my-app/
├── 🚀 server.ts              # Unified server (Next.js + NestJS)
├── 📦 package.json           # Root configuration
├── 🐳 Dockerfile             # Production Docker build
├── 🐘 docker-compose.yml     # Docker + PostgreSQL
│
├── apps/
│   ├── 🔙 api/                # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/          # Authentication (JWT)
│   │   │   ├── users/         # Users module
│   │   │   ├── todos/         # Example module
│   │   │   └── prisma/        # Database ORM
│   │   └── prisma/
│   │       └── schema.prisma  # Database schema
│   │
│   └── 🎨 web/                # Next.js Frontend
│       ├── app/               # App Router
│       │   ├── login/         # Login page
│       │   ├── register/      # Register page
│       │   ├── dashboard/     # Dashboard
│       │   └── actions/       # Server Actions
│       ├── lib/
│       │   └── api.ts         # 🔥 Type-safe SDK (NO URLS!)
│       └── features/          # Feature modules
│
└── 📝 .env.example            # Environment template
```

---

## 💡 The Magic - Zero URLs!

### ❌ Old Way (Without WEXTS)
```typescript
// Frontend
const response = await fetch('http://localhost:3001/api/users');
const users = await response.json();

// Problems:
// - Hardcoded URLs
// - No type safety
// - CORS issues
// - Environment management
```

### ✅ WEXTS Way
```typescript
// Frontend
import { api } from '@/lib/api';

const users = await api.users.findAll();
//    ✅ Type-safe
//    ✅ No URLs
//    ✅ Auto-complete
//    ✅ Works everywhere (Server/Client)
```

**The SDK is automatically connected to your backend!**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Unified Server (port 3000)          │
│                                             │
│  ┌────────────────┐    ┌─────────────────┐ │
│  │   Next.js      │    │    NestJS       │ │
│  │   Frontend     │    │    Backend      │ │
│  │                │    │                 │ │
│  │  - App Router  │    │  - Controllers  │ │
│  │  - Server      │    │  - Services     │ │
│  │    Actions     │    │  - Prisma ORM   │ │
│  │  - Components  │    │  - JWT Auth     │ │
│  └────────────────┘    └─────────────────┘ │
│                                             │
│         Smart Router Middleware             │
│  ┌─────────────────────────────────────┐   │
│  │  /api/* → NestJS                    │   │
│  │  /*     → Next.js                   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                     │
                     ▼
              PostgreSQL/SQLite
```

---

## 🛠️ Development

```bash
# Start dev server (both Next.js + NestJS)
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Run Prisma migrations
cd apps/api && npx prisma migrate dev

# Generate Prisma client
cd apps/api && npx prisma generate
```

---

## 🐳 Deployment

### Option 1: Docker (Recommended)

```bash
# Build and run everything
docker-compose up -d

# Your app is live at http://localhost:3000
# Includes PostgreSQL database!
```

### Option 2: Railway (Easiest)

1. Push to GitHub
2. Connect Railway to your repo
3. Add environment variables
4. Deploy! ✨

Railway auto-detects WEXTS and deploys everything.

### Option 3: Render / VPS

```bash
# Build
pnpm run build

# Start with environment variables
export DATABASE_URL="postgresql://..."
export JWT_SECRET="your-secret"
pnpm start
```

---

## 🔐 Environment Variables

Create `.env` in root:

```env
# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Database (Development - SQLite)
DATABASE_URL="file:./apps/api/dev.db"

# Database (Production - PostgreSQL)
# DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Server
PORT=3000
NODE_ENV=development
```

---

## 📚 API Examples

### Authentication

```typescript
import { api } from '@/lib/api';

// Register
const { user, access_token } = await api.auth.register({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
});

// Login
const { user, access_token } = await api.auth.login({
    email: 'user@example.com',
    password: 'password123'
});

// Get current user
const user = await api.auth.me();
```

### CRUD Operations

```typescript
// Get all todos
const todos = await api.todos.findAll();

// Create todo
const todo = await api.todos.create({
    title: 'Buy groceries',
    description: 'Milk, eggs, bread'
});

// Update todo
await api.todos.update('todo-id', {
    completed: true
});

// Delete todo
await api.todos.delete('todo-id');
```

**All type-safe, zero URLs! 🎉**

---

## 📖 Documentation

- [Getting Started](./docs/getting-started.md)
- [Architecture](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment.md)
- [Docker Guide](./DOCKER.md)
- [Railway Guide](./RAILWAY.md)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © WEXTS Team

---

## 🙏 Acknowledgments

Built with amazing technologies:
- [Next.js 16](https://nextjs.org/) - React framework
- [NestJS 11](https://nestjs.com/) - Node.js framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

<div align="center">

**Made with ❤️ for the TypeScript community**

[GitHub](https://github.com/ziadmustafa1/wexts) • [npm](https://www.npmjs.com/package/wexts) • [Documentation](./docs)

</div>
