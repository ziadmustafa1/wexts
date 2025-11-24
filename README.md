# Wexts Framework v2

![npm version](https://img.shields.io/npm/v/wexts)
![license](https://img.shields.io/npm/l/wexts)
![node version](https://img.shields.io/node/v/wexts)

**Wexts v2** is a modern, production‑ready full‑stack framework that seamlessly integrates **NestJS 11** and **Next.js 16**. Build type‑safe applications with automatic API client generation, shared types, and an exceptional developer experience.

> **Requirements:** Node.js 20.9.0+, PNPM 10.0.0+

## ✨ What's New in v2

- 🎯 **Next.js 16** with Turbopack (stable) and React Compiler
- 🚀 **NestJS 11** with latest architectural improvements
- ⚡ **TypeScript 5.9** with enhanced type inference
- 📦 **Modern Build System** with optimized bundling
- 🔥 **React 19** full support

## 🚀 Features

- **🔗 NestJS + Next.js Integration** – seamless backend‑frontend connection
- **📦 All‑in‑One SDK** – core utilities, HTTP client, decorators, and hooks in one package
- **🎯 Type‑Safe** – end‑to‑end TypeScript from database to UI
- **🛠️ CLI Tools** – scaffold projects, generate code, manage development
- **⚡ Auto API Client** – generate type‑safe clients from NestJS controllers
- **🔐 Auth Built‑in** – ready‑to‑use authentication hooks for Next.js
- **📝 Configuration Management** – environment‑aware config loader
- **🎨 React Hooks** – `useWexts()`, `useAuth()` for seamless API integration

---

## 📦 Installation

### Global CLI (run without installing globally)

```bash
npx wexts
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
npx wexts create my-app --template monorepo
cd my-app
pnpm dev
```

This creates:
- `apps/api/` – NestJS 11 backend
- `apps/web/` – Next.js 16 frontend
- `packages/types/` – shared TypeScript definitions
- `packages/api-client/` – auto‑generated SDK

---

## 📚 Usage

### NestJS Backend

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { WextsController, WextsGet, WextsPost } from 'wexts/nest';

@WextsController('users')
@Controller('users')
export class UsersController {
  @WextsGet()
  async findAll() {
    return this.usersService.findAll();
  }

  @WextsPost()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

**Benefits**: The `WextsController` and `WextsRoute` decorators add metadata for automatic API client generation.

---

### Next.js Frontend

#### Setup Provider

```tsx
// app/layout.tsx
import { WextsProvider } from 'wexts/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WextsProvider baseUrl={process.env.NEXT_PUBLIC_API_URL || '/api'}>
          {children}
        </WextsProvider>
      </body>
    </html>
  );
}
```

#### Use in Components

```tsx
'use client';
import { useWexts, useAuth } from 'wexts/next';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const { client } = useWexts();
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    client.get<User[]>('/users').then(setUsers);
  }, []);

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.name}!</p>}
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
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
  email: 'john@example.com',
});

// Automatic Bearer token from localStorage
// Token stored as 'wexts_token'
```

---

## ⚙️ Configuration

```typescript
import { config } from 'wexts';

// Load from wexts.config.json or environment variables
const dbUrl = config.load('database');
const apiKey = config.load('apiKey', 'default-key');

// Set runtime config
config.set('feature_flags', { newUI: true });
```

Create `wexts.config.json` in your project root:

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

**Environment Variables**: Prefix with `WEXTS_`

```bash
WEXTS_DATABASE=postgresql://localhost/mydb
WEXTS_JWT__SECRET=your-secret-key
```

---

## 🛠 CLI Commands

```bash
# Create new project
wexts create <name> [--template monorepo|api|web]

# Start development servers
wexts dev [--port <port>]

# Build for production
wexts build

# Generate code
wexts generate controller <name>

# Shortcut for generate
wexts g module <name>
```

---

## 📖 API Reference

### Core Modules

```typescript
import { Core, Config, Insight, Nest, Next } from 'wexts';
```

- **Core** – process management, filesystem utilities
- **Config** – configuration loader
- **Insight** – logging and metrics
- **Nest** – NestJS decorators and helpers
- **Next** – Next.js providers and hooks

### `wexts/client`

```typescript
import { WextsFetcher, apiFetcher } from 'wexts/client';
```

- **WextsFetcher** – HTTP client class
- **apiFetcher** – singleton instance

### `wexts/nest`

```typescript
import { WextsController, WextsGet, WextsPost, WextsPut, WextsDelete } from 'wexts/nest';
```

- NestJS decorators for API codegen (works alongside standard `@nestjs/common` decorators)

### `wexts/next`

```typescript
import { WextsProvider, useWexts, useAuth } from 'wexts/next';
```

- **WextsProvider** – React context provider for API client
- **useWexts()** – access API client in components
- **useAuth()** – authentication state management

### `wexts/types`

```typescript
import type { User, ApiResponse, WextsConfig } from 'wexts/types';
```

- Shared TypeScript type definitions

---

## 🏗️ Project Structure

When you create a project with `wexts create`, you get:

```text
my-app/
 ├── apps/
 │   ├── api/   # NestJS 11 backend
 │   │   └── src/
 │   └── web/   # Next.js 16 frontend
 │       └── app/
 ├── packages/
 │   ├── types/      # Shared DTOs
 │   └── api-client/  # Auto‑generated SDK
 ├── turbo.json
 ├── package.json
 └── wexts.config.json
```

---

## 🚀 Deployment

### Build

```bash
wexts build
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
