# Wexts Production Milestone Progress

## Current Blockers
- Fixed: `useWexts()` can now expose generated RPC service clients.
- Fixed: `wexts generate` generates a deterministic RPC manifest/client and fails when no services are found.
- Fixed: CLI placeholders were replaced with `create`, `dev`, `generate`, `build`, `start`, and `doctor`.
- Fixed: a reusable Fastify runtime path now exists with `/health`, `/api/health`, `/rpc`, optional Nest, optional Next, request logging, and shutdown.
- Fixed: `@wexts/security` now exists with strict Fastify controls and tests.
- Fixed: RPC/codegen/client/runtime/security regression tests were added.
- Fixed: top-level docs now avoid broad production-ready and battle-tested claims.
- Remaining: legacy demo/template auth clients still need consolidation before they should be treated as the official production template.

## Implementation Plan
1. Done: Establish repo rules and this progress tracker.
2. Done: Implement real RPC metadata discovery, deterministic manifest generation, and typed client generation.
3. Done: Update the Next client/provider so generated services are exposed through `useWexts()`.
4. Done: Replace placeholder CLI commands with working `create`, `dev`, `generate`, `build`, `start`, and `doctor` flows.
5. Done: Add a reusable Fastify runtime entry that loads generated manifests and mounts security before RPC/API/frontend routes.
6. Done: Add `@wexts/security` as an isolated package with strict defaults and tests.
7. Done: Add an official `examples/hello-rpc` app that proves the RPC path.
8. Done: Add CI release gates and honest docs.
9. Done: Run install, typecheck, tests, builds, example smoke checks, and doctor commands; document residual risks in final handoff.

## Notes
- The current pass will prioritize P0 blockers first and avoid restructuring every package unless required by implementation.
