# Wexts Framework

![npm version](https://img.shields.io/npm/v/wexts)
![license](https://img.shields.io/npm/l/wexts)

**Wexts** (formerly wexts) is a powerful, production-ready full-stack framework that unifies **NestJS 10** and **Next.js 16** development. Build type-safe applications with automatic API client generation, shared types, and zero boilerplate.

## 🚀 Features

- **🔗 NestJS + Next.js Integration**: Seamless backend-frontend connection
- **📦 All-in-One SDK**: Core utilities, HTTP client, decorators, and hooks in one package
- **🎯 Type-Safe**: End-to-end TypeScript from database to UI
- **🛠️ CLI Tools**: Scaffold projects, generate code, manage development
- **⚡ Auto API Client**: Generate type-safe clients from NestJS controllers
- **🔐 Auth Built-in**: Ready-to-use authentication hooks for Next.js
- **📝 Configuration Management**: Environment-aware config loader
- **🎨 React Hooks**: `useFusion()`, `useAuth()` for seamless API integration

---

## 📦 Installation

### Global CLI

```bash
npm install -g wexts
# or
yarn global add wexts
```

### Project Dependency

```bash
npm install wexts
# or
yarn add wexts
```

---

## 🏁 Quick Start

### Create New Project

```bash
fusion create my-app --template monorepo
cd my-app
fusion dev
```

This creates:
- `apps/api/` - NestJS 10 backend
- `apps/web/` - Next.js 16 frontend
- `packages/types/` - Shared TypeScript definitions
- `packages/api-client/` - Auto-generated SDK

---

## 📚 Usage

### NestJS Backend

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { FusionController, FusionGet, FusionPost } from 'wexts/nest';

@FusionController('users')
@Controller('users')
export class UsersController {
    @FusionGet()
    async findAll() {
        return this.usersService.findAll();
    }

    @FusionPost()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
```

**Benefits**: The `@FusionController` and `@FusionRoute` decorators add metadata for automatic API client generation.

---

### Next.js Frontend

#### Setup Provider

```tsx
// app/layout.tsx
import { FusionProvider } from 'wexts/next';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <FusionProvider baseUrl={process.env.NEXT_PUBLIC_API_URL || '/api'}>
                    {children}
                </FusionProvider>
            </body>
        </html>
    );
}
```

#### Use in Components

```tsx
'use client';
import { useFusion, useAuth } from 'wexts/next';
import { useEffect, useState } from 'react';

export default function UsersPage() {
    const { client } = useFusion();
    const { user, isAuthenticated } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        client.get<User[]>('/users').then(setUsers);
    }, []);

    return (
        <div>
            {isAuthenticated && <p>Welcome, {user.name}!</p>}
            <ul>
                {users.map(u => <li key={u.id}>{u.name}</li>)}
            </ul>
        </div>
    );
}
```

---

### HTTP Client

```typescript
import { apiFetcher } from 'wexts/client';

// GET request
const users = await apiFetcher.get<User[]>('/users');

// POST request
const newUser = await apiFetcher.post('/users', { 
    name: 'John',
    email: 'john@example.com' 
});

// Automatic Bearer token from localStorage
// Token stored as 'fusion_token'
```

---

### Configuration

```typescript
import { config } from 'wexts';

// Load from fusion.config.json or environment variables
const dbUrl = config.load('database');
const apiKey = config.load('apiKey', 'default-key');

// Set runtime config
config.set('feature_flags', { newUI: true });
```

---

### Logging

```typescript
import { logger, createLogger, LogLevel } from 'wexts';

logger.info('Application started');
logger.error('Connection failed:', error);
logger.success('Build complete!');

// Custom logger
const apiLogger = createLogger({ 
    prefix: '[API]',
    level: LogLevel.DEBUG,
    timestamp: true
});

apiLogger.debug('Detailed debug info');
```

---

## 🛠 CLI Commands

```bash
# Create new project
fusion create <name> [--template monorepo|api|web]

# Start development servers
fusion dev [--port <port>]

# Build for production
fusion build

# Generate code
fusion generate controller <name>
fusion g module <name>
```

---

## 📖 API Reference

### Core Modules

#### `wexts` (Main)

```typescript
import { Core, Config, Insight, Nest, Next } from 'wexts';
```

- **`Core`**: Process management, filesystem utilities
- **`Config`**: Configuration loader
- **`Insight`**: Logging and metrics
- **`Nest`**: NestJS decorators and helpers
- **`Next`**: Next.js providers and hooks

#### `wexts/client`

```typescript
import { FusionFetcher, apiFetcher } from 'wexts/client';
```

- **`FusionFetcher`**: HTTP client class
- **`apiFetcher`**: Singleton instance

#### `wexts/nest`

```typescript
import { 
    FusionController,
    FusionGet,
    FusionPost,
    FusionPut,
    FusionDelete 
} from 'wexts/nest';
```

- NestJS decorators for API codegen
- Works alongside standard `@nestjs/common` decorators

#### `wexts/next`

```typescript
import { 
    FusionProvider,
    useFusion,
    useAuth 
} from 'wexts/next';
```

- **`FusionProvider`**: React Context provider for API client
- **`useFusion()`**: Access API client in components
- **`useAuth()`**: Authentication state management

#### `wexts/types`

```typescript
import type { User, ApiResponse, FusionConfig } from 'wexts/types';
```

- Shared TypeScript type definitions

---

## 🏗️ Project Structure

When you create a new project with `fusion create`, you get:

```
my-app/
├── apps/
│   ├── api/                # NestJS 10 backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   └── users/
│   │   │       ├── users.controller.ts
│   │   │       └── users.service.ts
│   │   └── package.json
│   │
│   └── web/                # Next.js 16 frontend
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── users/
│       │       └── page.tsx
│       └── package.json
│
├── packages/
│   ├── types/              # Shared DTOs
│   │   └── src/
│   │       ├── user.ts
│   │       └── index.ts
│   │
│   └── api-client/         # Auto-generated SDK
│       └── src/
│           └── index.ts
│
├── turbo.json              # TurboRepo config
├── package.json            # Root package
└── fusion.config.json      # Fusion configuration
```

---

## ⚙️ Configuration

Create `fusion.config.json` in your project root:

```json
{
    "database": "postgresql://localhost/mydb",
    "apiPort": 5050,
    "webPort": 3000,
    "jwt": {
        "secret": "your-secret-key",
        "expiresIn": "7d"
    }
}
```

Access via:

```typescript
import { config } from 'wexts';

const dbUrl = config.load('database');
const jwtConfig = config.load('jwt');
```

**Environment Variables**: Prefix with `FUSION_`

```bash
FUSION_DATABASE=postgresql://localhost/mydb
FUSION_JWT__SECRET=your-secret-key
```

---

## 🔐 Authentication Example

### Backend (NestJS)

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { FusionPost } from 'wexts/nest';

@Controller('auth')
export class AuthController {
    @FusionPost()
    @Post('login')
    async login(@Body() credentials: LoginDto) {
        const token = await this.authService.validateUser(credentials);
        return { token, user: { id: 1, email: credentials.email } };
    }
}
```

### Frontend (Next.js)

```tsx
'use client';
import { useAuth } from 'wexts/next';

export default function LoginPage() {
    const { login, user, isAuthenticated, loading } = useAuth();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await login('user@example.com', 'password');
        // Automatically redirects or updates UI
    };

    if (loading) return <p>Loading...</p>;
    if (isAuthenticated) return <p>Welcome, {user.name}!</p>;

    return (
        <form onSubmit={handleLogin}>
            <input type="email" required />
            <input type="password" required />
            <button type="submit">Login</button>
        </form>
    );
}
```

---

## 🚀 Deployment

### Build

```bash
fusion build
```

### Deploy API (NestJS)

```bash
cd apps/api
npm run build
npm run start:prod
```

### Deploy Web (Next.js)

```bash
cd apps/web
npm run build
npm start
```

---

## 📄 License

MIT © [wexts Team](https://github.com/ziadmustafa1/wexts)

---

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 📬 Support

- **GitHub**: [ziadmustafa1/wexts](https://github.com/ziadmustafa1/wexts)
- **Issues**: [Report bugs](https://github.com/ziadmustafa1/wexts/issues)
- **Discussions**: [Community forums](https://github.com/ziadmustafa1/wexts/discussions)

---

**Built with ❤️ by the wexts Team**
