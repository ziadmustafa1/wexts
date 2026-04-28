# WEXTS Framework - Deployment Guide

Complete guide to deploying WEXTS projects on any platform.

---

## Deployment Modes

Wexts supports two deployment modes:

| Mode | Command | Runtime | Best For |
|------|---------|---------|----------|
| **VPS / Node** | `wexts start` | Long-running Fastify server | Full control, WebSockets, persistent connections |
| **Vercel (Serverless)** | `wexts vercel-build` | Serverless function via Build Output API v3 | Zero-ops, global edge, auto-scaling |

### VPS / Node Deployment

Deploy as a traditional long-running Node.js server:

```bash
# 1. Build
pnpm run build

# 2. Start production runtime
wexts start -c ./wexts.runtime.js
```

This starts a single Fastify server that serves:
- Next.js pages (SSR + static)
- NestJS API routes under `/api`
- Wexts RPC routes under `/rpc`
- Health endpoints at `/health` and `/api/health`

### Vercel Deployment

Deploy as a serverless function using Vercel Build Output API v3:

```bash
# One command does everything:
wexts vercel-build

# Or with options:
wexts vercel-build \
  -p apps/api \
  -o apps/web/lib/wexts \
  -c ./wexts.runtime.js \
  --node-version 20 \
  --max-duration 30
```

This command:
1. Runs RPC codegen
2. Builds the API (TypeScript) and Next.js app
3. Creates `.vercel/output/config.json` (version: 3)
4. Creates `.vercel/output/functions/index.func/` with serverless entry
5. Copies static assets to `.vercel/output/static/`
6. Validates the output structure

#### Vercel Build Output Structure

```
.vercel/output/
├── config.json              # { "version": 3 }
├── static/                  # Public assets, _next/static
│   ├── favicon.ico
│   └── _next/static/...
└── functions/
    └── index.func/
        ├── .vc-config.json  # Vercel function config
        ├── index.js         # Serverless entry point
        ├── package.json     # Resolved dependencies (no workspace:*)
        ├── wexts.runtime.js # Runtime config
        └── apps/
            ├── api/dist/    # Compiled API services
            └── web/lib/wexts/
                └── wexts.rpc.manifest.json
```

#### Vercel CLI Workflow

```bash
# Install Vercel CLI
npm i -g vercel

# Build the output
wexts vercel-build

# Deploy (Vercel reads .vercel/output automatically)
vercel deploy --prebuilt
```

---

## Serverless Limitations (Vercel Mode)

> **Important:** The Vercel deployment mode is serverless, not a long-running Node.js process.

| Feature | VPS (`wexts start`) | Vercel (`wexts vercel-build`) |
|---------|---------------------|-------------------------------|
| WebSocket | ✅ Supported | ❌ Not supported |
| Long-lived connections | ✅ Supported | ❌ Max 30s (configurable) |
| Server-Sent Events | ✅ Supported | ⚠️ Limited by function timeout |
| Background tasks | ✅ Supported | ❌ Function terminates after response |
| File system writes | ✅ Persistent | ❌ Ephemeral (`/tmp` only) |
| Cold starts | N/A | ⚠️ Possible on first request |
| RPC calls | ✅ Full | ✅ Full |
| Health endpoints | ✅ `/health`, `/api/health` | ✅ `/health`, `/api/health` |
| NestJS API | ✅ Full | ✅ Full (stateless only) |
| Next.js SSR | ✅ Full | ✅ Full |

### What won't work on Vercel

1. **WebSocket connections** — Vercel functions are request/response only. Use a dedicated WebSocket service (e.g., Ably, Pusher, or a VPS) for real-time features.
2. **Long-running background tasks** — The function terminates after the response is sent. Use Vercel Cron or an external queue for background work.
3. **Persistent in-memory state** — Each invocation may run on a different instance. Use a database or external cache (Redis) for shared state.
4. **File uploads to disk** — The file system is read-only except `/tmp`. Use cloud storage (S3, Vercel Blob) for file uploads.

---

## Runtime Architecture

### VPS Mode (`startWextsServer`)

```
┌─────────────────────────────────────┐
│  Fastify Server (listen on port)    │
│  ├── Security Shield                │
│  ├── /health, /api/health           │
│  ├── /rpc/:service/:method (POST)   │
│  ├── /api/* (NestJS)                │
│  └── /* (Next.js SSR)               │
└─────────────────────────────────────┘
```

### Vercel Mode (`createWextsHandler`)

```
┌──────────────────────────────────────┐
│  Vercel Function (req, res)          │
│  └── createWextsHandler()            │
│      └── Fastify (no listen)         │
│          ├── Security Shield         │
│          ├── /health, /api/health    │
│          ├── /rpc/:service/:method   │
│          ├── /api/* (NestJS)         │
│          └── /* (Next.js SSR)        │
└──────────────────────────────────────┘
```

The key difference: `createWextsHandler()` creates the same Fastify instance but **never calls `fastify.listen()`**. Instead, it returns a `(req, res) => void` handler that Vercel invokes for each request.

---

## Platform Comparison

| Platform | Best For | Pros | Cons | Price |
|----------|----------|------|------|-------|
| **VPS (wexts start)** | Full-stack, WebSockets | Full control, persistent connections | Manual scaling | Varies |
| **Vercel (wexts vercel-build)** | Next.js apps, zero-ops | Auto-scaling, global CDN, fast | No WebSockets, cold starts | Free tier, $20/mo Pro |
| **Netlify** | JAMstack, static sites | Great plugin ecosystem | Complex serverless setup | Free tier, $19/mo Pro |
| **Railway** | Full-stack monorepos | Easy setup, PostgreSQL included | Newer platform | $5/mo + usage |
| **Render** | Traditional apps | PostgreSQL, cron jobs | Slower cold starts | Free tier, $7/mo Starter |

---

## Environment Variables

### All Platforms

```bash
NODE_ENV=production
```

### VPS Additional

```bash
PORT=3000              # Server port (default: 3000)
HOST=0.0.0.0           # Bind address (default: 0.0.0.0)
```

### Vercel Additional

Configure via Vercel dashboard or `vercel env add`:

```bash
# These are set automatically by Vercel:
# VERCEL=1
# VERCEL_ENV=production
```

### Application Variables

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-strong-secret-key
NEXT_PUBLIC_API_URL=https://your-domain.com
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] `wexts doctor` passes
- [ ] `wexts doctor --security` passes
- [ ] Health check endpoints responding
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Monitoring alerts configured

### Vercel-Specific Checklist

- [ ] `wexts vercel-build` completes without errors
- [ ] `.vercel/output/config.json` exists with `version: 3`
- [ ] `.vercel/output/functions/index.func/` has all required files
- [ ] No `workspace:*` dependencies in generated `package.json`
- [ ] `vercel deploy --prebuilt` succeeds
- [ ] WebSocket-dependent features have alternative implementations

---

## Getting Help

- **WEXTS**: [wexts.vercel.app](https://wexts.vercel.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Build Output API**: [vercel.com/docs/build-output-api/v3](https://vercel.com/docs/build-output-api/v3)
