# Runtime

The Wexts production runtime is a single Fastify server.

## Routes

- `/health`: Wexts runtime health check.
- `/api/health`: API health check.
- `/rpc/:service/:method`: generated Wexts RPC.
- `/*`: Next.js frontend routes when `nextDir` is configured.

## Runtime Config

```js
/** @type {import('wexts/runtime').WextsRuntimeConfig} */
module.exports = {
  rootDir: __dirname,
  port: Number(process.env.PORT || 3000),
  nextDir: 'apps/web',
  rpcManifestPath: 'apps/web/lib/wexts/wexts.rpc.manifest.json',
  security: {
    enabled: true,
    production: process.env.NODE_ENV === 'production',
    allowedOrigins: ['https://example.com'],
  },
};
```

## Start

```bash
NODE_ENV=production PORT=3210 wexts start -c ./wexts.runtime.js
```

## Dev vs Production

`wexts dev` runs separate web/API processes for local iteration. Single-port serving is the production `wexts start` path.
