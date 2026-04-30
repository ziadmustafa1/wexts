# Vercel Deployment

Wexts includes `wexts vercel-build` to produce Vercel Build Output API v3 artifacts for the official example path.

## Build Locally

```bash
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
pnpm --filter wexts-example-hello-rpc vercel-build
```

The output is written to:

```text
.vercel/output
```

## Command

```bash
wexts vercel-build \
  -p apps/api \
  -o apps/web/lib/wexts \
  -c ./wexts.runtime.js
```

Options:

- `--skip-codegen`: use an existing generated RPC client.
- `--skip-build`: skip project build.
- `--node-version <version>`: Vercel function Node.js major version.
- `--max-duration <seconds>`: serverless max duration.

## Limitations

Serverless deployments are not the same as the VPS single-process runtime. Validate cold start, function duration, and platform routing before claiming production readiness.
