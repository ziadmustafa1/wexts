# Project Structure

The canonical example is `examples/hello-rpc`.

```text
examples/hello-rpc/
  apps/
    api/
      src/
        hello.service.ts
      tsconfig.json
    web/
      app/
      lib/wexts/
        client.ts
        index.ts
        wexts.rpc.manifest.json
  scripts/smoke.mjs
  wexts.runtime.js
  package.json
```

## Responsibilities

- `apps/api`: NestJS providers and Wexts RPC services.
- `apps/web`: Next.js App Router frontend.
- `apps/web/lib/wexts`: generated RPC manifest/client. Do not hand-edit.
- `wexts.runtime.js`: production runtime config.
- `scripts/smoke.mjs`: example health and RPC smoke test.

## Production Rule

Production start must consume compiled code and generated manifests. It must not run file watchers, ts-node, runtime source scanning, or codegen.
