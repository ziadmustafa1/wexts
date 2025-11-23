# Fusion Dev Server

Unified development server for running NestJS + Next.js together.

## Usage

From monorepo root:

```bash
fusion dev
```

With custom options:

```bash
fusion dev -a ./apps/api -w ./apps/web -p 3000 --api-port 5050
```

## Features

✅ **Concurrent Processes** - Run API and Web servers simultaneously
✅ **Colored Output** - Easy to distinguish between server logs
✅ **HTTP Proxy** - Automatic `/api` routing from Next.js to NestJS
✅ **WebSocket Support** - Full duplex communication
✅ **Hot Reload** - Both servers reload on code changes
✅ **Graceful Shutdown** - Clean process termination with Ctrl+C

## How It Works

1. **Process Runner** - Spawns NestJS (`npm run start:dev`) and Next.js (`npm run dev`)
2. **Proxy Server** - Creates HTTP proxy on web port to forward `/api/*` to API port
3. **Log Management** - Prefixes each log line with colored server name

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `-a, --api <path>` | Path to NestJS app | `./apps/api` |
| `-w, --web <path>` | Path to Next.js app | `./apps/web` |
| `-p, --port <port>` | Web server port | `3000` |
| `--api-port <port>` | API server port | `5050` |
| `--no-proxy` | Disable proxy (direct API calls) | Proxy enabled |

## Example Output

```
🚀 Starting development servers...

[API] Starting...
[Web] Starting...
✅ Proxy server running on port 3000
   Forwarding /api/* → http://localhost:5050

╔═══════════════════════════════════════╗
║   Fusion Development Server Ready    ║
╚═══════════════════════════════════════╝

🌐 Web:  http://localhost:3000
🔌 API:  http://localhost:5050
🔄 Proxy: Enabled (3000/api → 5050)

[API] NestJS application successfully started
[Web] ▲ Next.js 16.0.0
[Web] - Local: http://localhost:3000
```

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (Port 3000)    │
└────────┬────────┘
         │
         │ /api/* requests
         ▼
┌─────────────────┐
│  Proxy Server   │
│  (Port 3000)    │
└────────┬────────┘
         │
         │ Forward to
         ▼
┌─────────────────┐
│   NestJS API    │
│  (Port 5050)    │
└─────────────────┘
```

## Requirements

- Both apps must have `package.json` with:
  - API: `start:dev` script
  - Web: `dev` script
- npm/pnpm/yarn installed
- Node.js 18+
