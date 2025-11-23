# Migration Guide: v1.x → v2.0

This guide will help you migrate your Wexts projects from v1.x to v2.0.

## Overview

Wexts v2.0 is a major update that modernizes the framework with the latest stable versions of Next.js, NestJS, React, and TypeScript. While there are breaking changes, the migration process is straightforward.

## Breaking Changes Summary

| Component | v1.x | v2.0 | Impact |
|-----------|------|------|--------|
| Node.js | 18+ | 20.9.0+ | 🔴 High |
| Next.js | 14/15/16 | 16+ only | 🟡 Medium |
| NestJS | 10.x | 11.x | 🟡 Medium |
| React | 18/19 | 19+ only | 🟢 Low |
| TypeScript | 5.3+ | 5.9+ | 🟢 Low |

## Prerequisites

### 1. Update Node.js

**Required:** Node.js 20.9.0 or higher

```bash
# Check your current version
node --version

# If below 20.9.0, update using nvm (recommended)
nvm install 20
nvm use 20
```

### 2. Update PNPM

**Required:** PNPM 10.0.0 or higher

```bash
# Check current version
pnpm --version

# Update PNPM globally
npm install -g pnpm@latest
```

## Step-by-Step Migration

### Step 1: Update Dependencies

#### Root `package.json`

```diff
{
  "devDependencies": {
-   "@types/node": "^22.19.1",
+   "@types/node": "^22.10.2",
-   "turbo": "^2.0.0",
+   "turbo": "^2.3.3",
-   "typescript": "~5.8.2",
+   "typescript": "~5.9.3",
-   "tailwindcss": "^4.1.17"
+   "tailwindcss": "^4.2.0"
  },
  "engines": {
-   "node": ">=18.0.0"
+   "node": ">=20.9.0",
+   "pnpm": ">=10.0.0"
  }
}
```

#### Update `wexts` package

```bash
pnpm update wexts@^2.0.0
```

Or in your `package.json`:

```diff
{
  "dependencies": {
-   "wexts": "^1.0.1"
+   "wexts": "^2.0.0"
  },
  "peerDependencies": {
-   "@nestjs/common": "^10.0.0",
-   "@nestjs/core": "^10.0.0",
+   "@nestjs/common": "^11.0.0",
+   "@nestjs/core": "^11.0.0",
-   "react": "^18.0.0 || ^19.0.0",
+   "react": "^19.0.0",
-   "next": "^14.0.0 || ^15.0.0 || ^16.0.0"
+   "next": "^16.0.0"
  }
}
```

### Step 2: Update Next.js Application

#### 2.1 Update Async Request APIs

**Breaking Change:** In Next.js 16, `headers()`, `cookies()`, `params`, and `searchParams` are now async.

**Before (v1.x):**
```typescript
// app/page.tsx
import { headers, cookies } from 'next/headers';

export default function Page() {
  const headersList = headers();
  const cookieStore = cookies();
  const userAgent = headersList.get('user-agent');
  
  return <div>{userAgent}</div>;
}
```

**After (v2.0):**
```typescript
// app/page.tsx
import { headers, cookies } from 'next/headers';

export default async function Page() {
  const headersList = await headers();
  const cookieStore = await cookies();
  const userAgent = headersList.get('user-agent');
  
  return <div>{userAgent}</div>;
}
```

#### 2.2 Update Route Handlers

**Before:**
```typescript
// app/api/users/route.ts
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  // ...
}
```

**After:**
```typescript
// app/api/users/route.ts
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  // ...
}
```

#### 2.3 Update Dynamic Routes

**Before:**
```typescript
// app/users/[id]/page.tsx
type Props = {
  params: { id: string };
};

export default function UserPage({ params }: Props) {
  return <div>User: {params.id}</div>;
}
```

**After:**
```typescript
// app/users/[id]/page.tsx
type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  return <div>User: {id}</div>;
}
```

### Step 3: Update NestJS Application

#### 3.1 Update NestJS Dependencies

```bash
pnpm update @nestjs/common@^11.0.0 @nestjs/core@^11.0.0
```

#### 3.2 Check for Deprecated Features

NestJS 11 may have deprecated some features. Run:

```bash
pnpm run build
```

Check for any deprecation warnings in your NestJS application.

### Step 4: Update TypeScript Configuration

#### Update `tsconfig.json`

```diff
{
  "compilerOptions": {
-   "target": "ES2022",
+   "target": "ES2023",
-   "lib": ["ES2022"],
+   "lib": ["ES2023"],
+   "noUncheckedIndexedAccess": true,
+   "verbatimModuleSyntax": false
  }
}
```

### Step 5: Update Turbo Configuration

Add environment variable handling to `turbo.json`:

```diff
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
-   "**/.env.*local"
+   "**/.env.*local",
+   ".npmrc",
+   "tsconfig.base.json"
  ],
+ "globalEnv": [
+   "NODE_ENV",
+   "CI"
+ ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
+     "env": ["NODE_ENV"]
    }
  }
}
```

### Step 6: Add `.npmrc` Configuration

Create a `.npmrc` file in your project root:

```ini
enable-pre-post-scripts=true
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
node-linker=isolated
```

### Step 7: Clean Install

```bash
# Remove old dependencies
rm -rf node_modules pnpm-lock.yaml

# Clean install
pnpm install
```

### Step 8: Verify Migration

```bash
# Type checking
pnpm typecheck

# Build
pnpm build

# Run tests
pnpm test

# Start dev server
pnpm dev
```

## Common Issues and Solutions

### Issue 1: Type Errors with Request APIs

**Error:**
```
Type 'HeadersInstance' is not assignable to type 'Promise<HeadersInstance>'
```

**Solution:**
Add `await` before `headers()`, `cookies()`, etc.

### Issue 2: PNPM Installation Errors

**Error:**
```
ERR_PNPM_PEER_DEP_ISSUES
```

**Solution:**
1. Ensure PNPM is version 10.0.0+
2. Check `.npmrc` configuration
3. Use `pnpm install --force` if necessary

### Issue 3: NestJS Module Not Found

**Error:**
```
Cannot find module '@nestjs/...'
```

**Solution:**
```bash
pnpm add @nestjs/common@^11.0.0 @nestjs/core@^11.0.0
```

### Issue 4: React Type Errors

**Error:**
```
Property 'children' does not exist on type 'FC<Props>'
```

**Solution:**
Update `@types/react` to 19.x:
```bash
pnpm add -D @types/react@^19.0.6
```

## New Features in v2.0

Take advantage of these new capabilities:

### 1. Next.js 16 Turbopack (Stable)

Enable Turbopack for faster development:

```bash
pnpm dev --turbo
```

### 2. React 19 Features

Use new React 19 hooks and features:

```typescript
import { use } from 'react';

function Component({ dataPromise }) {
  const data = use(dataPromise);
  return <div>{data}</div>;
}
```

### 3. Enhanced Type Safety

Benefit from improved TypeScript 5.9 inference:

```typescript
// Better type inference for const type parameters
function createArray<const T>(items: readonly T[]) {
  return items;
}

const arr = createArray([1, 2, 3] as const);
// Type: readonly [1, 2, 3]
```

## Rollback Plan

If you encounter issues and need to rollback:

```bash
# Reinstall v1.x
pnpm add wexts@^1.0.1

# Restore package.json from git
git checkout package.json

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Getting Help

- 📚 [Documentation](https://github.com/ziadmustafa1/wexts)
- 🐛 [Report Issues](https://github.com/ziadmustafa1/wexts/issues)
- 💬 [Discussions](https://github.com/ziadmustafa1/wexts/discussions)

## Conclusion

The migration to v2.0 brings significant improvements in performance, developer experience, and type safety. While there are breaking changes, they align with the latest best practices in the React and Node.js ecosystems.

**Estimated migration time:** 30 minutes to 2 hours, depending on project size.
