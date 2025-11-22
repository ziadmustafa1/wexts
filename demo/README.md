# Fusion Demo

Complete example monorepo demonstrating wexts features.

## Structure

```
demo/
├── apps/
│   ├── api/          # NestJS 10 backend
│   └── web/          # Next.js 16 frontend
└── packages/
    └── api-client/   # Auto-generated (will be created by codegen)
```

## Setup

```bash
# Install all dependencies
npm install

# Install dependencies for each app
cd apps/api && npm install && cd ../..
cd apps/web && npm install && cd ../..
```

## Development

### Option 1: Fusion Dev Server (Recommended)

```bash
npm run dev
```

This will:
- Start NestJS API on `http://localhost:5050`
- Start Next.js Web on `http://localhost:3000`
- Enable proxy `/api` → `http://localhost:5050`
- Show colored logs for each server

### Option 2: Manual

```bash
# Terminal 1 - API
cd apps/api
npm run start:dev

# Terminal 2 - Web
cd apps/web
npm run dev
```

## Features Demo

### 1. Authentication
- Register: `POST /auth/register`
- Login: `POST /auth/login`
- Get profile: `GET /auth/me`

### 2. Todos CRUD
- List: `GET /todos`
- Create: `POST /todos`
- Update: `PUT /todos/:id`
- Delete: `DELETE /todos/:id`

### 3. Fusion Decorators

See `apps/api/src/auth/auth.controller.ts` and `apps/api/src/todos/todos.controller.ts` for examples of `@FusionController` and `@FusionGet/Post/etc` usage.

### 4. Fusion Hooks

See `apps/web/app/dashboard/page.tsx` for examples of `useFusion()` and `useAuth()` hooks.

### 5. Auto Codegen (Coming Soon)

```bash
# Generate API client from NestJS controllers
fusion codegen -p ./apps/api -o ./packages/api-client/src --watch
```

## Testing

1. Open browser: `http://localhost:3000`
2. Click "Sign up" and create account
3. Login with credentials
4. Use todo app (add/complete/delete)
5. Check API logs in colored output

## What's Included

✅ **Backend (NestJS)**
- JWT Authentication
- Prisma ORM (SQLite)
- Users & Todos modules
- Guards & DTOs
- Fusion decorators

✅ **Frontend (Next.js)**
- App Router
- Auth flow
- Protected routes
- Fusion Provider
- Beautiful UI with Tailwind

✅ **Dev Tools**
- Unified dev server
- Hot reload
- Proxy server
- Colored logs

## Build for Production

```bash
npm run build
```

This will build both apps using TurboRepo.
