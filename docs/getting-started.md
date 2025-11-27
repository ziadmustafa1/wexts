# Getting Started with WEXTS

Welcome to WEXTS! This guide will help you create your first full-stack TypeScript application.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Basic knowledge of TypeScript, React, and Node.js

## Quick Start

### 1. Create Project

```bash
npx wexts create my-app
cd my-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

Default `.env`:
```env
JWT_SECRET=your-secret-key-change-this
DATABASE_URL="file:./apps/api/dev.db"
PORT=3000
NODE_ENV=development
```

### 4. Setup Database

```bash
cd apps/api
npx prisma migrate dev
cd ../..
```

### 5. Start Development Server

```bash
pnpm run dev
```

Open http://localhost:3000 - your app is running! 🎉

## Project Structure

```
my-app/
├── server.ts              # Unified server entry point
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/     # Authentication module
│   │   │   ├── users/    # Users module
│   │   │   └── todos/    # Example CRUD module
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── web/              # Next.js frontend
│       ├── app/          # App router pages
│       ├── lib/
│       │   └── api.ts    # Type-safe SDK
│       └── features/     # Feature modules
```

## Understanding the Architecture

### The Unified Server

WEXTS runs a single Node.js process that handles both frontend and backend:

```typescript
// server.ts
const server = express();

// Smart routing
server.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        return next(); // → NestJS handles this
    }
    return nextHandler(req, res); // → Next.js handles this
});
```

### The Type-Safe SDK

Instead of using URLs, you call APIs through a type-safe SDK:

```typescript
// apps/web/lib/api.ts
export const api = {
    auth: {
        login: (data) => request('/auth/login', data),
        register: (data) => request('/auth/register', data),
    },
    users: {
        me: () => request('/users/me'),
    },
};
```

Usage:
```typescript
import { api } from '@/lib/api';

// Type-safe, auto-complete, zero URLs!
const user = await api.auth.login({ email, password });
```

## Your First Feature

Let's create a simple "Posts" feature.

### 1. Backend (NestJS)

#### Create Prisma Schema

```prisma
// apps/api/prisma/schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

Run migration:
```bash
cd apps/api
npx prisma migrate dev --name add_posts
```

#### Create Module

```bash
cd apps/api
npx nest g module posts
npx nest g controller posts
npx nest g service posts
```

#### Implement Service

```typescript
// apps/api/src/posts/posts.service.ts
@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.post.findMany();
    }

    async create(data: { title: string; content?: string; authorId: string }) {
        return this.prisma.post.create({ data });
    }
}
```

#### Implement Controller

```typescript
// apps/api/src/posts/posts.controller.ts
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Post()
    create(@Body() dto: CreatePostDto, @Request() req) {
        return this.postsService.create({
            ...dto,
            authorId: req.user.userId
        });
    }
}
```

### 2. Frontend (Next.js)

#### Update SDK

```typescript
// apps/web/lib/api.ts
export const api = {
    // ... existing methods
    posts: {
        findAll: () => request<Post[]>('GET', '/posts'),
        create: (data: CreatePostDto) => 
            request<Post>('POST', '/posts', data),
    },
};
```

#### Create Page

```typescript
// apps/web/app/posts/page.tsx
import { api } from '@/lib/api';

export default async function PostsPage() {
    const posts = await api.posts.findAll();

    return (
        <div>
            <h1>Posts</h1>
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

That's it! You have a working posts feature. 🎉

## Next Steps

- [Architecture Guide](./architecture.md) - Understand the internals
- [API Reference](./api-reference.md) - Full API documentation
- [Deployment Guide](./deployment.md) - Deploy to production
- [Examples](../demo) - More examples

## Common Tasks

### Adding a New API Endpoint

1. Create NestJS controller/service
2. Add to SDK (`apps/web/lib/api.ts`)
3. Use in components/pages

### Adding Authentication to Route

```typescript
@Controller('posts')
@UseGuards(JwtAuthGuard) // ← Add this
export class PostsController {
    // ...
}
```

### Environment Variables

```typescript
// Access in NestJS
constructor(private config: ConfigService) {
    const secret = this.config.get('JWT_SECRET');
}

// Access in Next.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Database Queries

```typescript
// Prisma examples
await this.prisma.post.findMany();
await this.prisma.post.create({ data });
await this.prisma.post.update({ where: { id }, data });
await this.prisma.post.delete({ where: { id } });
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Prisma Issues

```bash
# Reset database
cd apps/api
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Build Issues

```bash
# Clean and rebuild
rm -rf node_modules dist .next
pnpm install
pnpm run build
```

## Getting Help

- [Documentation](../docs)
- [GitHub Issues](https://github.com/ziadmustafa1/wexts/issues)
- [Discussions](https://github.com/ziadmustafa1/wexts/discussions)

Happy coding! 🚀
