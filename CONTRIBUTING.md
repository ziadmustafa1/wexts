# Contributing

Wexts is a production-focused Next.js + NestJS toolkit. Contributions should preserve the verified `examples/hello-rpc` path and avoid broad rewrites.

## Setup

```bash
git clone https://github.com/ziadmustafa1/wexts.git
cd wexts
pnpm install
```

## Required Checks

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
pnpm --filter wexts-example-hello-rpc vercel-build
pnpm release:artifact-check
pnpm audit
```

## Architecture Rules

- Do not add runtime source scanning.
- Do not run codegen during production start.
- Do not weaken Wexts Shield defaults.
- Keep CLI/codegen dependencies out of runtime paths when practical.
- Keep `@wexts/security` as a real semver dependency in published packages.
- Do not present legacy `demo/` or templates as the recommended production path.

## Pull Request Checklist

- Tests added or updated for behavior changes.
- Docs updated for user-facing changes.
- Error codes added for new failure modes.
- Changeset added for published package changes.
- Breaking changes documented in `MIGRATION.md`.

## Commit Style

Use focused commits with clear prefixes:

- `fix:`
- `feat:`
- `docs:`
- `test:`
- `chore:`

## Security

Report sensitive issues privately. See `SECURITY.md`.
