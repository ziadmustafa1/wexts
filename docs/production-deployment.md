# Production Deployment

Wexts is a production-focused single-runtime Next.js + NestJS toolkit. It provides application-layer controls and does not replace provider-level network protection.

## Dev vs Production Runtime

`wexts dev` starts the API TypeScript compiler in watch mode and runs the Wexts runtime in development mode on the web port, so local browser RPC calls use the same `/rpc` origin as production.

`wexts start` is the supported single-port production runtime path. It serves health checks, RPC, optional Nest, and optional Next from one Fastify server.

Before deploying:
- Run `pnpm install`.
- Run `pnpm typecheck`.
- Run `pnpm test`.
- Run `pnpm build`.
- Run the official example build and smoke test.
- Run `wexts doctor`.
- Run `wexts doctor --security`.

Security requirements:
- Put the runtime behind Cloudflare, a WAF, load balancer controls, or cloud-native DDoS protection for network-level attacks.
- Configure strict CORS allowlists.
- Use strong secrets and fail startup when required secrets are missing.
- Keep Wexts Shield enabled before Next, Nest, and RPC routes.
- Review route policies and mark public RPC endpoints explicitly.

Known limitations:
- In-memory rate limiting and concurrency limiting protect a single process only.
- Cluster or multi-instance deployments need a shared `rateLimitStore` adapter for coordinated application-layer limits.
- Generated RPC manifests must be produced before production start.
- Production start must not use `ts-node`, watchers, or runtime source scanning.
