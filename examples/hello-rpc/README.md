# Wexts Hello RPC Example

This example proves the production milestone path:

```bash
pnpm install
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
pnpm --filter wexts-example-hello-rpc start
pnpm --filter wexts-example-hello-rpc smoke
```

It exposes a backend RPC service and calls it from the frontend:

```ts
const wexts = useWexts();
await wexts.hello.sayHello("Bob");
```
