# AI Maintainer Guide (Wexts Monorepo)

This document is specifically designed to be read by AI coding assistants (like Cursor, GitHub Copilot, Windsurf, or Claude) when assisting contributors or maintainers of the `wexts` repository.

If you are an AI assistant, **read this file carefully before making any codebase modifications.**

## Monorepo Overview
Wexts is a unified single-runtime toolkit that combines Next.js (frontend) and NestJS (backend) using a typed RPC bridge. The repository is a monorepo managed with `pnpm`.

## Core Project Structure

### 1. `packages/src/` (The Core Framework)
This is the heart of the framework. It is modularized into several internal directories:
- **`cli/`**: Contains the `wexts` CLI tool. Handles commands like `start`, `dev`, `build`, `doctor`, `generate`, and `vercel-build`.
- **`codegen/`**: Responsible for generating the RPC manifest (`wexts.rpc.manifest.json`) and the typed client SDK used by the frontend.
- **`runtime/`**: Contains the single-runtime execution logic (`server.ts`). It spins up a Fastify server, mounts NestJS under `/api`, handles Wexts RPC under `/rpc`, and serves Next.js under `*`.
- **`rpc/`**: The core RPC bridge logic. Defines the protocol for frontend-to-backend communication.
- **`nest/`**: Exports the decorators used in NestJS (`@RpcService`, `@RpcMethod`).
- **`next/`**: Exports Next.js integration utilities (like `FusionProvider`, `useWexts`).
- **`client/`**: Contains the browser/Node logic for the generated RPC client to make requests.
- **`vercel-builder/`**: Handles the logic to package the Wexts application for Vercel's serverless Build Output API (`.vercel/output`).
- **`dev-server/`**: Custom development server logic (if any) to coordinate Next.js and NestJS during `wexts dev`.

### 2. `packages/templates/`
Contains the starter templates that get copied when users run `wexts create`. 
- **`nestjs-api`**: The backend template.
- **`nextjs-web`**: The frontend template.
- Make sure to update the `.cursorrules` inside the template strings in `packages/src/cli/index.ts` if you want changes to propagate to new projects.

### 3. `examples/`
Contains test examples.
- `examples/hello-rpc/`: A working Wexts application used for smoke testing during CI/CD.

### 4. `docs/`
Contains the documentation website, which is itself a Next.js (or similar) app inside `docs/apps/docs-web`.

## Build System
- The project is built using `tsup` configured in `packages/tsup.config.ts`.
- Building compiles everything from `packages/src/` into `packages/dist/`.
- If you modify code in `packages/src/`, always run `pnpm build` in the root (or inside `packages`) to test it.
- **CLI Wrapper**: The executable binary is linked via `packages/bin/wexts.cjs`.

## Hard Rules for AI Modifications
1. **Never use `ts-node`** in production runtime. The `wexts start` command must operate purely on compiled JavaScript (`.js` files).
2. **Deterministic Codegen**: The `wexts generate` command must not execute user code at runtime. It relies on AST parsing or static analysis.
3. **No Magic Routing**: NestJS handles `/api` (and `/rpc` for Wexts internally). Everything else falls back to Next.js.
4. **Follow `AGENTS.md`**: Refer to `AGENTS.md` in the root for specific "Forbidden Patterns" and "Definition of Done".
5. **No CLI Fakes**: If a CLI command is incomplete, do not mock it. It should be intentionally absent with clear documentation.

## How to Test Your Changes
When you write code in the `packages/src` folder, you can test it by running:
```bash
pnpm build
cd examples/hello-rpc
pnpm test
pnpm smoke
```
Or use the CLI command directly via the local binary:
```bash
node ../../packages/bin/wexts.cjs start -c ./wexts.runtime.js
```

## Summary for AI Context Limits
When memory is limited, just remember:
- Backend: NestJS (Fastify)
- Frontend: Next.js (App Router)
- Bridge: AST-parsed RPC mapped to Fastify routes.
- Entry: `packages/src/cli/index.ts` -> `packages/src/runtime/server.ts`
