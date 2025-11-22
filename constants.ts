

export const DEFAULT_NEST_CONTROLLER = `
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateTodoDto, Todo } from '@fusion/types';

@Controller('todos')
export class TodosController {
  
  @Get()
  async findAll(): Promise<Todo[]> {
    return [];
  }

  @Post()
  async create(@Body() dto: CreateTodoDto): Promise<Todo> {
    return { id: '1', ...dto };
  }
}
`;

export const FUSION_CONFIG_EXAMPLE = `
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
`;

export const FUSION_CLI_ASCII = `
  _____          _             _  _____ 
 |  ___|   _ ___(_) ___  _ __ | |/ /__ \\
 | |_ | | | / __| |/ _ \\| '_ \\|   /  / /
 |  _|| |_| \\__ \\ | (_) | | | |   \\ |_| 
 |_|   \\__,_|___/_|\\___/|_| |_|_|\\_\\(_) 
                                        
wexts v2.0.0-alpha - The Future of Full-Stack
`;

export const FUSION_FILE_TREE = `
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
`;

export const PRISMA_SCHEMA = `
// packages/db/prisma/schema.prisma
// Generator: client-js (v6.0.0)

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
`;

export const MOCK_DB_DATA = [
  { id: 'u_1', email: 'alex@fusion.dev', name: 'Alex', posts: 3 },
  { id: 'u_2', email: 'sarah@fusion.dev', name: 'Sarah', posts: 1 },
  { id: 'u_3', email: 'dev@fusion.dev', name: 'Developer', posts: 12 },
];

export const MOCK_REQUESTS = [
  { id: 'req_1', timestamp: '10:23:41', method: 'GET', endpoint: 'api.users.findAll()', status: 200, duration: '45ms', type: 'RPC' },
  { id: 'req_2', timestamp: '10:23:45', method: 'POST', endpoint: 'api.todos.create()', status: 201, duration: '120ms', type: 'RPC' },
  { id: 'req_3', timestamp: '10:24:01', method: 'GET', endpoint: 'api.posts.getOne(id)', status: 200, duration: '30ms', type: 'RPC' },
  { id: 'req_4', timestamp: '10:24:15', method: 'GET', endpoint: '/_next/static/chunk.js', status: 200, duration: '10ms', type: 'REST' },
  { id: 'req_5', timestamp: '10:25:00', method: 'DELETE', endpoint: 'api.users.delete()', status: 403, duration: '15ms', type: 'RPC' },
  { id: 'req_6', timestamp: '10:25:05', method: 'POST', endpoint: 'api.auth.login()', status: 200, duration: '85ms', type: 'RPC' },
];

// --- SDK PACKAGE BOILERPLATE ---

export const SDK_PACKAGE_JSON = `{
  "name": "@wexts/sdk",
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
}`;

export const SDK_TSUP_CONFIG = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
`;

export const SDK_FETCHER_TS = `// packages/api-client/src/fetcher.ts

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
       if (token) headers['Authorization'] = \`Bearer \${token}\`;
    }

    const response = await fetch(\`\${this.baseUrl}\${path}\`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(\`Fusion API Error: \${response.statusText}\`);
    }

    return response.json();
  }

  get<T>(path: string) { return this.request<T>('GET', path); }
  post<T>(path: string, body: any) { return this.request<T>('POST', path, body); }
  put<T>(path: string, body: any) { return this.request<T>('PUT', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const apiFetcher = new FusionFetcher();
`;