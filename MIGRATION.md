# Migration

## Canonical Path

Use `examples/hello-rpc` as the reference path for new production-focused work.

## From Legacy Demo/Templates

The legacy `demo/` and bundled templates are compatibility paths. Migrate toward:

```text
apps/api/src/*.service.ts
apps/web/lib/wexts/generated-files
wexts.runtime.js
```

## From Manual RPC Clients

1. Add `@RpcService()` and `@RpcMethod()` to backend services.
2. Run `wexts generate`.
3. Use `useWexts()` or the generated `createWextsClient()`.

## From `workspace:*` Published Dependencies

Published manifests must use semver:

```json
{
  "dependencies": {
    "@wexts/security": "^0.1.0"
  }
}
```

## Breaking Change Checklist

- Add a changeset.
- Document migration steps.
- Add or update regression tests.
- Verify `examples/hello-rpc`.
- Run `pnpm release:artifact-check`.
