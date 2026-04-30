# Migration Guide

## From Legacy Demo/Templates To `hello-rpc`

Use `examples/hello-rpc` as the reference structure.

```bash
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
pnpm --filter wexts-example-hello-rpc vercel-build
```

## From Hand-Written Clients To Generated RPC

1. Add `@RpcService()` and `@RpcMethod()` to backend services.
2. Run `wexts generate`.
3. Replace direct URL calls with the generated client.

```ts
const wexts = useWexts();
await wexts.hello.sayHello('Bob');
```

## From `workspace:*` To Published Semver

Published package manifests must use real semver ranges.

```json
{
  "dependencies": {
    "@wexts/security": "^0.1.0"
  }
}
```

## Breaking Change Checklist

- Update generated example.
- Add or update regression tests.
- Update docs and error codes.
- Add a changeset.
- Verify artifact install with `pnpm release:artifact-check`.
