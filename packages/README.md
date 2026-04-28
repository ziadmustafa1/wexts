# Wexts Package

`wexts` is a production-focused toolkit for running Next.js + NestJS behind one Fastify production runtime with generated typed RPC.

## Stable In This Patch

- `wexts generate` creates a deterministic RPC manifest and typed client.
- `wexts start` starts the Fastify production runtime.
- `wexts doctor` and `wexts doctor --security` validate common release blockers.
- `wexts/next` exposes `FusionProvider`, `useFusion`, and `useWexts<T>()`.
- `wexts/client` exposes `createWextsRpcClient()`.
- `wexts/rpc` exposes RPC metadata types/decorators.
- `wexts/runtime` exposes the production runtime helpers.

## Canonical Example

Use `examples/hello-rpc` from the repository as the release-verified path.

```bash
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
pnpm --filter wexts-example-hello-rpc run doctor
pnpm --filter wexts-example-hello-rpc run doctor:security
```

## Production Runtime

Production runtime is single-port:

- `/health`
- `/api/health`
- `/rpc/:service/:method`
- optional Nest under `/api`
- optional Next frontend routes

Development mode currently runs separate web/API processes. Use `wexts start` for the supported single-port runtime path.

## Security

Use `@wexts/security` / Wexts Shield before runtime routes. It provides application-layer controls. It does not replace Cloudflare/WAF/provider DDoS protection, and its default memory rate limit store is single-process only.

## Deprecated Compatibility Paths

- `demo/`
- `packages/templates/nestjs-api`
- `packages/templates/nextjs-web`
- legacy Fusion controller codegen paths

These are retained for compatibility and should not be marketed as the recommended production structure.
