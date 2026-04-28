# Wexts Release Audit

## Safe For Patch Release
- `examples/hello-rpc` is the canonical verified path for this patch release.
- Generated RPC manifest/client flow is covered by tests and the example.
- `useWexts<T>()` can expose generated RPC services.
- Production runtime exposes `/health`, `/api/health`, and `/rpc` through Fastify.
- `@wexts/security` provides application-layer protection before runtime routes.
- CI gates install, typecheck, lint, tests, build, example build, doctor checks, and smoke checks.

## Still Experimental
- Full app scaffolding from the older `packages/templates/*` auth/dashboard templates.
- Legacy `demo/` app and its Express-style unified server.
- Fusion decorator compatibility in `packages/src/nest/decorators.ts` and legacy controller parser paths.
- Distributed rate limiting/concurrency control; Wexts Shield currently ships an in-memory default store for single-process mode.

## Deprecated
- `demo/` is deprecated for production guidance. Use `examples/hello-rpc`.
- `packages/templates/nestjs-api` and `packages/templates/nextjs-web` are deprecated legacy templates.
- `packages/templates/server.ts` and `packages/templates/api-sdk.ts` are deprecated legacy scaffold assets.
- Docs pages that describe “Fusion Insight” are informational/experimental, not release guarantees.

## Must Not Be Marketed As Production-Ready
- Legacy demo and old templates.
- Automatic RPC for arbitrary Nest controllers without explicit `@RpcService()` and `@RpcMethod()`.
- Network-level DDoS protection.
- Multi-instance rate limiting without a shared store adapter.
- Dev mode as a single-port runtime; single-port is the production runtime path.

## Cleanup Completed In This Pass
- `demo/README.md`, `demo/apps/api/README.md`, `demo/apps/web/README.md`: marked deprecated.
- `packages/templates/README.md`, `packages/templates/nestjs-api/README.md`, `packages/templates/nextjs-web/README.md`: marked deprecated and pointed to `examples/hello-rpc`.
- `packages/templates/nestjs-api/src/auth/*` and `demo/apps/api/src/auth/*`: removed `default-secret` fallback.
- `README.md`, `packages/README.md`, and docs app copy: removed universal production, zero-config, and no-URL claims.
- `packages/src/cli/index.ts`: avoids eager codegen imports and keeps command errors explicit.
- `packages/security/src/index.ts`: documents and validates single-process memory-store limitations.
