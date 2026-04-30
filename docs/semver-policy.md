# Semver Policy

Wexts published packages follow Semantic Versioning.

## Patch

- Bug fixes.
- Documentation corrections.
- Error message clarity without API shape changes.
- Test and release gate hardening.

## Minor

- New backwards-compatible CLI generators.
- New exported types or helpers.
- New optional runtime/security configuration.

## Major

- Removed public APIs.
- Changed generated client shape.
- Changed runtime route semantics.
- Changed minimum supported framework major versions.

## Release Gate

```bash
pnpm install
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
