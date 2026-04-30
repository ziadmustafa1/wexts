# Getting Started

Use the official verified example first. It proves the current production path: generated RPC, Next frontend, Nest-style service metadata, Wexts runtime, health checks, and smoke tests.

## Prerequisites

- Node.js 20.9+
- pnpm 10+
- Git

## Run The Verified Example

```bash
git clone https://github.com/ziadmustafa1/wexts.git
cd wexts
pnpm install
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
PORT=3210 pnpm --filter wexts-example-hello-rpc start
```

In another shell:

```bash
WEXTS_SMOKE_URL=http://127.0.0.1:3210 pnpm --filter wexts-example-hello-rpc smoke
```

## Create RPC Service

```bash
wexts generate rpc hello -p apps/api
wexts generate -p apps/api -o apps/web/lib/wexts
```

Backend service:

```ts
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return `Hello, ${name}!`;
  }
}
```

Frontend call:

```ts
const wexts = useWexts();
await wexts.hello.sayHello('Bob');
```

## Validate

```bash
wexts doctor
wexts doctor --security
```

## Next Docs

- [Installation](./installation.md)
- [Project Structure](./project-structure.md)
- [RPC](./rpc.md)
- [Codegen](./codegen.md)
- [Runtime](./runtime.md)
- [CLI](./cli.md)
- [Known Limitations](./known-limitations.md)
