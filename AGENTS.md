# Wexts Maintainer Rules

## Package Manager
- Use `pnpm` for workspace installs and scripts.
- Do not publish packages from this repository during local maintenance.
- Keep CLI/codegen/dev-only dependencies out of runtime paths when practical.

## Core Commands
- Install: `pnpm install`
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`
- Package tests: `pnpm --filter wexts test`
- Security package tests: `pnpm --filter @wexts/security test`

## Architecture Rules
- Wexts is a production-focused single-runtime Next.js + NestJS toolkit.
- Runtime startup must not scan source files or run codegen.
- Codegen owns service discovery and generated RPC manifests.
- Runtime owns serving Fastify, Nest under `/api`, Wexts RPC under `/rpc`, Next routes, health endpoints, logging, and shutdown.
- Security controls must run before Next, Nest, and RPC.
- Keep package responsibilities narrow; do not add duplicate systems for RPC, runtime, or security.
- Use peer dependencies for framework integrations where appropriate.

## Forbidden Patterns
- No fake hardcoded SDKs or generated clients.
- No production `ts-node`, file watchers, or codegen during `start`.
- No runtime service scanning.
- No claims of DDoS-proofing, field-proven status, or universal production readiness.
- No dead placeholder commands such as "not implemented".
- No secret logging or client-side secret exposure.
- Do not revert unrelated user changes.

## Definition Of Done
- The requested behavior has tests or an explicit documented reason why it cannot be tested locally.
- RPC generation is deterministic and fails clearly when no services are found.
- CLI commands either work or are intentionally absent with documentation; no command should pretend to work.
- Production runtime uses generated manifests/config and exposes `/health` and `/api/health`.
- Security defaults are strict, configurable, and documented with DDoS limitations.
- Docs describe current guarantees honestly.
