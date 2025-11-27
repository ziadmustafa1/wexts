# WEXTS Templates

This directory contains all the templates needed to create a WEXTS unified server application.

## 📁 Files Included

### Core Templates
- `server.ts` - Unified server that runs Next.js + NestJS in one process
- `api-sdk.ts` - Type-safe SDK for API calls (zero URLs needed!)
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

These templates are used by the WEXTS CLI when creating a new project:

```bash
npx wexts create my-app
```

## ✨ Features

✅ **Unified Server** - Single Node.js process for frontend + backend  
✅ **Zero URLs** - Type-safe SDK without explicit API URLs  
✅ **Smart Routing** - Automatic routing between Next.js and NestJS  
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
