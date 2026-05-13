# Wexts Dev Server

Unified development runner for a Wexts app.

## Usage

From the project root:

```bash
wexts dev
```

With custom options:

```bash
wexts dev -a ./apps/api -w ./apps/web -c ./wexts.runtime.js -p 3000 --api-port 5050
```

## Features

✅ **API compiler watcher** - Runs the API TypeScript compiler in watch mode.
✅ **Single-origin browser RPC** - Starts the Wexts runtime on the web port so `/rpc/*`, health checks, and Next routes share the same origin.
✅ **Colored Output** - Prefixes API and Web/runtime logs.
✅ **Hot Reload** - Next.js runs in runtime development mode while the API compiler watches source changes.
✅ **Graceful Shutdown** - Stops child processes with Ctrl+C.

## How It Works

1. **API process** - Runs `pnpm run start:dev` when `apps/api/package.json` exists; otherwise runs `pnpm exec tsc -w -p apps/api/tsconfig.json` from the project root.
2. **Web process** - Runs `pnpm exec wexts start -c ./wexts.runtime.js -p 3000 --dev`.
3. **Runtime routing** - The Wexts runtime serves `/health`, `/api/health`, `/rpc/:service/:method`, and Next routes on the web port.

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `-a, --api <path>` | Path to API app | `./apps/api` |
| `-w, --web <path>` | Path to Next.js app | `./apps/web` |
| `-c, --config <path>` | Runtime config module path | `./wexts.runtime.js` |
| `-p, --port <port>` | Web/runtime port | `3000` |
| `--api-port <port>` | API compiler environment port | `5050` |
| `--proxy` | Legacy proxy flag; intentionally rejected | disabled |

## Example Output

```
🚀 Starting development servers...

[API] Starting...
[Web] Starting...

╔═══════════════════════════════════════╗
║   Fusion Development Server Ready    ║
╚═══════════════════════════════════════╝

🌐 Web + RPC:  http://localhost:3000
🔌 API compiler: /path/to/app/apps/api
```

## Requirements

- `pnpm` installed.
- A generated RPC manifest referenced by `wexts.runtime.js`.
- Compiled API services available to the runtime config. In dev mode, `wexts start --dev` retries loading the config briefly while the API compiler emits `dist`.
