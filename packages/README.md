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

**Build production-ready full-stack apps with Next.js 16 + NestJS 11 in a unified runtime**

[![npm version](https://img.shields.io/npm/v/wexts.svg)](https://www.npmjs.com/package/wexts)
[![Downloads](https://img.shields.io/npm/dm/wexts.svg)](https://www.npmjs.com/package/wexts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

[Quick Start](#-quick-start) • [Documentation](https://github.com/ziadmustafa1/wexts#documentation) • [Examples](https://github.com/ziadmustafa1/wexts/tree/main/demo)

</div>

---

## ✨ Why WEXTS?

Stop managing separate Next.js and NestJS servers. **WEXTS runs both in a single Node.js process** with zero configuration.

**Traditional Approach:**
```
❌ Two separate servers (Next.js + NestJS)
❌ Complex proxy setup
❌ CORS configuration nightmare
❌ URLs everywhere in your code
❌ Two deployments to manage
```

**WEXTS:**
```
✅ One unified server
✅ Smart routing (automatic)
✅ Zero configuration
✅ Type-safe SDK (no URLs!)
✅ Single deployment
```

---

## 🎯 Key Features

- 🔥 **Unified Runtime** - Single Node.js process for frontend + backend
- 🎨 **Zero URLs** - Call APIs without explicit URLs
- ⚡ **Type-Safe** - End-to-end TypeScript with auto-complete
- 🚀 **Production Ready** - Docker, Railway, Render, Vercel support
- 🔒 **Auth Built-in** - JWT authentication out of the box
- 📦 **Prisma ORM** - Database integration ready
- 🐳 **Docker Ready** - Complete Docker setup included

---

## 🚀 Quick Start

```bash
# Create new project
npx wexts create my-app

# Start development
cd my-app
pnpm install
pnpm run dev

# Open http://localhost:3000
```

**That's it!** Your unified server is running with:
- ✅ Next.js frontend
- ✅ NestJS backend API
- ✅ Smart routing
- ✅ Hot reload

---

## 💡 The Magic - Zero URLs!

### ❌ Without WEXTS

```typescript
// Hardcoded URLs everywhere
const response = await fetch('http://localhost:3001/api/users');
const users = await response.json();

// Problems:
// - No type safety
// - CORS issues
// - Environment management
// - Proxy configuration
```

### ✅ With WEXTS

```typescript
import { api } from '@/lib/api';

// Type-safe, zero URLs, works everywhere!
const users = await api.users.findAll();
//    ✅ Auto-complete
//    ✅ Type-safe
//    ✅ No configuration
```

**The SDK automatically connects to your backend. No URLs needed!**

---

## 📖 Project Structure

```
my-app/
├── 🚀 server.ts              # Unified server
├── apps/
│   ├── 🔙 api/                # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/          # JWT Authentication
│   │   │   └── prisma/        # Database ORM
│   │   └── prisma/schema.prisma
│   │
│   └── 🎨 web/                # Next.js Frontend
│       ├── app/               # App Router
│       └── lib/
│           └── api.ts         # 🔥 Type-safe SDK
│
├── 🐳 Dockerfile             # Production build
└── docker-compose.yml         # Docker + PostgreSQL
```

---

## 🏗️ How It Works

```
┌─────────────────────────────────────────┐
│      Single Node.js Process            │
│                                         │
│  ┌──────────┐        ┌──────────┐     │
│  │ Next.js  │        │  NestJS  │     │
│  │ Frontend │        │  Backend │     │
│  └──────────┘        └──────────┘     │
│                                         │
│       Smart Router Middleware          │
│  ┌─────────────────────────────┐      │
│  │  /api/* → NestJS            │      │
│  │  /*     → Next.js           │      │
│  └─────────────────────────────┘      │
└─────────────────────────────────────────┘
```

**No proxy. No CORS. Just works.** ✨

---

## 🔐 Built-in Authentication

```typescript
// Register
const { user, access_token } = await api.auth.register({
    email: 'user@example.com',
    password: 'secure123',
    name: 'John Doe'
});

// Login
const { user, access_token } = await api.auth.login({
    email: 'user@example.com',
    password: 'secure123'
});

// Get current user
const user = await api.auth.me();
```

**Secure JWT authentication with httpOnly cookies included!**

---

## 🐳 Deploy Anywhere

### Docker (Recommended)

```bash
docker-compose up -d
```

**Includes PostgreSQL!** Your app is live at `http://localhost:3000`

### Railway (Easiest)

```bash
# Push to GitHub, connect Railway, done!
```

Railway auto-detects WEXTS configuration.

### Render / VPS

```bash
pnpm run build
pnpm start
```

**One build. One deployment. Works everywhere.**

---

## 📚 Full Example

```typescript
// Backend - apps/api/src/posts/posts.controller.ts
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Post()
    create(@Body() dto: CreatePostDto) {
        return this.postsService.create(dto);
    }
}

// Frontend - apps/web/lib/api.ts
export const api = {
    posts: {
        findAll: () => request<Post[]>('GET', '/posts'),
        create: (data) => request<Post>('POST', '/posts', data),
    },
};

// Usage - apps/web/app/posts/page.tsx
import { api } from '@/lib/api';

export default async function PostsPage() {
    const posts = await api.posts.findAll(); // Type-safe!
    
    return (
        <div>
            {posts.map(post => (
                <article key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </article>
            ))}
        </div>
    );
}
```

**Complete type safety from database to UI!**

---

## 🛠️ Commands

```bash
# Development
pnpm run dev          # Start dev server

# Production
pnpm run build        # Build everything
pnpm start            # Start production server

# Database
cd apps/api
npx prisma migrate dev
npx prisma studio
```

---

## 📦 What's Included

- **Next.js 16** - Latest React framework with App Router
- **NestJS 11** - Modern Node.js framework
- **Prisma** - Type-safe database ORM
- **JWT Auth** - Secure authentication
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first CSS
- **Docker** - Production deployment
- **Examples** - Auth, CRUD, and more

---

## 🎯 Perfect For

✅ Full-stack applications  
✅ SaaS products  
✅ Admin dashboards  
✅ API + Web combo  
✅ Production-ready apps  
✅ Rapid prototyping  

---

## 📚 Documentation

- [Getting Started](https://github.com/ziadmustafa1/wexts/blob/main/docs/getting-started.md)
- [Architecture](https://github.com/ziadmustafa1/wexts/blob/main/docs/architecture.md)
- [API Reference](https://github.com/ziadmustafa1/wexts/blob/main/docs/api-reference.md)
- [Deployment](https://github.com/ziadmustafa1/wexts/blob/main/docs/deployment.md)
- [Examples](https://github.com/ziadmustafa1/wexts/tree/main/demo)

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](https://github.com/ziadmustafa1/wexts/blob/main/CONTRIBUTING.md)

---

## 📄 License

MIT © WEXTS Team

---

## 🙏 Built With

- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

<div align="center">

**Stop managing separate servers. Start building with WEXTS.** 🚀

[GitHub](https://github.com/ziadmustafa1/wexts) • [npm](https://www.npmjs.com/package/wexts) • [Documentation](https://github.com/ziadmustafa1/wexts#readme)

Made with ❤️ for the TypeScript community

</div>
