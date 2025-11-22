# wexts Framework Specification

The definitive guide to the unified **Next.js 16** + **NestJS 10** monorepo architecture. Combining backend power with frontend speed.

## 🚀 Features

- **Auto-Linking** - Automatic type-safe API client generation from NestJS controllers
- **Monorepo Native** - Built on TurboRepo with shared types and packages
- **React 19 + Next.js 16** - Latest features including Server Components and PPR
- **NestJS 10** - Modern backend with Fastify adapter
- **Fusion Insight** - Development GUI for monitoring RPC calls and database
- **Type-Safe** - End-to-end TypeScript from database to client
- **Prisma Integration** - Type-safe database operations

## 📦 Installation

```bash
npm install -g @ziad_mostafa/cli
```

## 🎯 Quick Start

```bash
# Create a new project
fusion init my-app

# Navigate to project
cd my-app

# Start development servers
fusion dev

# Build for production
fusion build
```

## 🏗️ Monorepo Structure

Optimized for TurboRepo. Uses **React 19 (RC)** and **NestJS 10** by default.

```
wexts/
 ├── fusion.config.ts
 ├── apps/
 │    ├── web/      (Next.js 16 + React 19)
 │    └── api/      (NestJS 10)
 ├── packages/
 │    ├── types/    (Shared DTOs)
 │    ├── core/     (Validation/Utils)
 │    ├── api-client/(Auto-generated SDK)
 │    └── ui/       (Tailwind v4 + RSC)
 ├── cli/
 ├── turbo.json
 └── package.json
```

## 📚 SDK Publishing Guide

**For Package Authors**

To publish `@ziad_mostafa/sdk` to npm, use the following boilerplate for the `packages/api-client` directory.

### packages/api-client/package.json

```json
{
  "name": "@ziad_mostafa/sdk",
  "version": "0.0.1",
  "description": "Auto-generated API client for wexts",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "files": [
    "dist"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "release": "npm run build && npm publish --access public",
    "lint": "eslint src",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["wexts", "sdk", "nestjs", "nextjs"],
  "author": "wexts Team",
  "license": "MIT",
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### packages/api-client/tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

### packages/api-client/src/fetcher.ts

```typescript
// packages/api-client/src/fetcher.ts

export class FusionFetcher {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Automatically attach Fusion Token if present
    if (typeof window !== 'undefined') {
       const token = localStorage.getItem('fusion_token');
       if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Fusion API Error: ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(path: string) { return this.request<T>('GET', path); }
  post<T>(path: string, body: any) { return this.request<T>('POST', path, body); }
  put<T>(path: string, body: any) { return this.request<T>('PUT', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const apiFetcher = new FusionFetcher();
```

To publish:
```bash
npm publish --access public
```

## ⚙️ Global Configuration

The `fusion.config.ts` file controls the monorepo behavior, including the developer proxy that routes traffic from Next.js to NestJS automatically.

```typescript
import { defineConfig } from 'wexts';

export default defineConfig({
  apps: {
    web: 'apps/web',   // Next.js 16 (App Router + PPR)
    api: 'apps/api'    // NestJS 10 (Fastify)
  },
  dev: {
    webPort: 3000,
    apiPort: 5050, // Auto-random if not set
    proxy: true    // Proxies /api/* from Web -> Api
  },
  ui: {
    engine: 'tailwind-v4' // Oxide Engine
  },
  codegen: {
    output: 'packages/api-client',
    watch: true
  }
});
```

## 💻 CLI Commands

| Command | Description |
| :--- | :--- |
| `fusion new module [name]` | Creates Controller, Service, and Next.js Page. |
| `fusion dev` | Starts monorepo in watch mode with Proxy & Insight GUI. |
| `fusion generate controller` | Adds a new NestJS controller and updates SDK. |
| `fusion build` | Compiles API, Web, and Packages for prod. |

## 📄 License

MIT © wexts Team
