# Wexts

Production-focused single-runtime toolkit for Next.js + NestJS with generated typed RPC, a Fastify production server, Wexts Shield application-layer protection, CLI/codegen, tests, and an official verified example.

## Current Release Status

The canonical verified path is [`examples/hello-rpc`](./examples/hello-rpc). CI and local verification cover:

- RPC manifest/client generation
- `const wexts = useWexts(); await wexts.hello.sayHello("Bob")`
- production build
- `wexts start`
- `/health`
- `/rpc/hello/sayHello`
- `wexts doctor`
- `wexts doctor --security`

Legacy `demo/` and `packages/templates/*` are deprecated for production guidance and retained only for compatibility while scaffolding is consolidated.

## Architecture

- Production runtime: one Fastify server.
- NestJS is mounted under `/api` when configured.
- Wexts RPC is served under `/rpc` from a generated manifest.
- Next.js handles frontend routes.
- Wexts Shield runs before Next, Nest, and RPC.
- Codegen runs before production start; runtime does not scan source files.

Development mode currently starts separate web/API processes for fast local iteration. Single-port serving is the supported production runtime path.

## Quickstart

```bash
npx wexts create my-app
cd my-app
pnpm install
pnpm run generate
pnpm run build
pnpm run doctor
pnpm run doctor:security
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Installation](./docs/installation.md)
- [Project Structure](./docs/project-structure.md)
- [RPC](./docs/rpc.md)
- [Codegen](./docs/codegen.md)
- [Runtime](./docs/runtime.md)
- [VPS Deployment](./docs/vps-deployment.md)
- [Vercel Deployment](./docs/vercel-deployment.md)
- [Wexts Shield](./docs/wexts-shield.md)
- [CLI](./docs/cli.md)
- [Error Codes](./docs/error-codes.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Known Limitations](./docs/known-limitations.md)
- [Migration Guide](./docs/migration-guide.md)
- [Semver Policy](./docs/semver-policy.md)

## RPC

Backend services opt in explicitly:

```ts
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return `Hello, ${name}!`;
  }
}
```

Generate the client:

```bash
wexts generate -p apps/api -o apps/web/lib/wexts
```

Use it from the frontend:

```ts
const wexts = useWexts();
await wexts.hello.sayHello("Bob");
```

## Security

`@wexts/security` provides application-layer protection: security headers, strict CORS, CSRF checks for cookie-auth mutations, body/request limits, route policies, in-memory rate limiting, concurrency limits, RPC auth policy, audit logs, and redaction.

The default rate limit store is single-process only. Multi-instance deployments need a shared store adapter. Network-level DDoS requires Cloudflare, a WAF, load balancer controls, or provider protection.

## Release Gate

Before release:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
pnpm --filter wexts-example-hello-rpc run doctor
pnpm --filter wexts-example-hello-rpc run doctor:security
```

Then start the example and run smoke:

```bash
PORT=3210 pnpm --filter wexts-example-hello-rpc start
WEXTS_SMOKE_URL=http://127.0.0.1:3210 pnpm --filter wexts-example-hello-rpc smoke
```

## Limitations

- Legacy demo/templates are not production references.
- RPC is generated from explicit Wexts RPC decorators, not every arbitrary Nest controller.
- In-memory security limits are not distributed.
- Dev mode is separate-process; production runtime is single-port.

MIT.
