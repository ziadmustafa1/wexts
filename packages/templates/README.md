# Deprecated Legacy Templates

These templates predate the verified `examples/hello-rpc` runtime/RPC/security model. They are retained for compatibility while the scaffold is consolidated.

For release validation and production guidance, use `examples/hello-rpc`. Do not treat these legacy templates as the recommended production app structure.

---

# WEXTS Legacy Templates

This directory contains all the templates needed to create a WEXTS unified server application.

## 📁 Files Included

### Core Templates
- `server.ts` - Unified server that runs Next.js + NestJS in one process
- `api-sdk.ts` - legacy SDK scaffold retained for compatibility
- `root-package.json` - Root package.json with all scripts
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template

### Deployment Templates
- `Dockerfile` - Docker multi-stage build
- `docker-compose.yml` - Docker Compose with PostgreSQL
- `.dockerignore` - Docker ignore file
- `nixpacks.toml` - Railway deployment config
- `Procfile` - Render/Heroku deployment

### App Templates
- `nestjs-api/` - NestJS backend template
- `nextjs-web/` - Next.js frontend template

## 🚀 Usage

These templates are legacy scaffold assets. The canonical verified example is:

```bash
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
```

## ✨ Features

✅ **Unified Server** - Single Node.js process for frontend + backend  
✅ **Generated RPC** - In the canonical `examples/hello-rpc` path  
✅ **Smart Routing** - In the production Fastify runtime  
✅ **Docker Ready** - Complete Docker setup included  
✅ **Multi-Platform Deploy** - Railway, Render, Docker, VPS  

## 📦 Template Structure

```
project/
├── server.ts              ← Unified server
├── package.json           ← Root package
├── tsconfig.json          ← TS config
├── .env.example           ← Env template
├── Dockerfile             ← Docker build
├── docker-compose.yml     ← Docker + DB
├── apps/
│   ├── api/              ← From nestjs-api template
│   └── web/              ← From nextjs-web template
```

## 🔧 Customization

Templates can be customized before project creation. See CLI documentation for details.
