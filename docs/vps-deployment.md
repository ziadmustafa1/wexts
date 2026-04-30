# VPS Deployment

This path is for a single VM or container host.

## Build

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
```

## Start

```bash
cd examples/hello-rpc
NODE_ENV=production PORT=3210 pnpm start
```

## Health Check

```bash
curl -fsS http://127.0.0.1:3210/health
curl -fsS http://127.0.0.1:3210/api/health
```

## Process Manager

Use systemd, Docker, or a platform supervisor. Example systemd command:

```ini
ExecStart=/usr/bin/pnpm --filter wexts-example-hello-rpc start
Environment=NODE_ENV=production
Environment=PORT=3210
```

## Security Boundary

Put the app behind TLS termination and provider/network DDoS protection. Wexts Shield is application-layer protection, not a network-level DDoS solution.
