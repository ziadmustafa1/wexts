# WEXTS - Unified Full-Stack Framework

## 🎯 What is WEXTS?

WEXTS is a **unified runtime framework** that merges Next.js (frontend) and NestJS (backend) into a **single Node.js server process**.

- ✅ **No URLs** - Frontend calls backend without any URLs
- ✅ **No configuration** - Zero environment variables needed
- ✅ **One command** - `pnpm run dev` starts everything
- ✅ **One deployment** - Single Docker container or Node app
- ✅ **Type-safe SDK** - Auto-generated from NestJS controllers

## 🚀 Quick Start

```bash
cd demo
pnpm install
pnpm run dev
```

Open http://localhost:3000 - **Everything works!**

## 📁 Project Structure

```
demo/
├── server.ts          # Unified runtime (runs both apps)
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── wexts-sdk/    # Generated API SDK
└── package.json       # "dev": "tsx server.ts"
```

## 🔥 How It Works

### Unified Server (`server.ts`)

```typescript
// 1. Boot Next.js
const nextApp = next({ dev, dir: './apps/web' });
const nextHandler = nextApp.getRequestHandler();
await nextApp.prepare();

// 2. Boot NestJS on /api prefix
const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(server));
nestApp.setGlobalPrefix('api');
await nestApp.init();

// 3. Route non-API requests to Next.js
server.use((req, res) => nextHandler(req, res));

// 4. Start unified server
server.listen(3000);
```

### Result

- `/api/*` → NestJS handles all API routes
- Everything else → Next.js handles (pages, assets, etc.)
- **Same process, same port (3000)**

## 💎 Usage in Frontend

### Using the Internal SDK

```typescript
// No URLs needed!
import { api } from '@/lib/api';

// In Server Components
const users = await api.auth.me();
const todos = await api.todos.findAll();

// In Client Components
'use client';
async function handleLogin(data) {
  const result = await api.auth.login(data);
  // ...
}
```

### How SDK Works

```typescript
// lib/api.ts
const API_BASE = '/api'; // Relative path - same origin!

async function request(method, path, data) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

export const api = {
  auth: {
    login: (data) => request('POST', '/auth/login', data),
    register: (data) => request('POST', '/auth/register', data),
  },
  todos: {
    findAll: () => request('GET', '/todos'),
    create: (data) => request('POST', '/todos', data),
  },
};
```

## 🌐 Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
CMD ["node", "server.js"]
```

### Vercel / Railway / Render

- **Start Command**: `tsx server.ts`
- **Port**: 3000
- **Environment**: Add `DATABASE_URL`, `JWT_SECRET`

## ✅ Benefits

| Feature | Traditional | WEXTS |
|---------|------------|-------|
| Servers | 2 separate | **1 unified** |
| URLs | Hardcoded | **None** |
| CORS | Required | **Not needed** |
| Deployment | Complex | **Single unit** |
| Type Safety | Manual | **Auto-generated** |

## 🎓 Architecture

```
┌─────────────────────────────────────┐
│     Single Node.js Process          │
│                                     │
│  ┌──────────┐       ┌──────────┐  │
│  │ Next.js  │  /api │  NestJS  │  │
│  │ (:3000)  │◄──────┤  (prefix)│  │
│  └──────────┘       └──────────┘  │
│       ↓                    ↓       │
│  Frontend UI         Backend API   │
│                                     │
└─────────────────────────────────────┘
```

## 📝 Adding Routes

### Backend (NestJS)

```typescript
// apps/api/src/posts/posts.controller.ts
@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}
```

### Frontend (Auto-available!)

```typescript
// Frontend immediately has access:
const posts = await api.posts.findAll();
```

## 🔧 Configuration

### Environment Variables (Optional)

```env
# For production only
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3000
```

Development works **without any .env file**!

## 🎯 Key Principles

1. **Single Runtime** - One Node.js process runs everything
2. **No URLs** - API calls use relative paths (`/api`)
3. **Type Safety** - SDK generated from NestJS  
4. **Zero Config** - Works out of the box
5. **Deploy Anywhere** - Docker, VPS, PaaS - all work

## 📚 Learn More

- [Architecture](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Reference](./API.md)

---

**WEXTS** - One runtime. One deployment. Zero configuration. 🚀
