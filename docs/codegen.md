# Codegen

Codegen discovers decorated Wexts RPC services and writes a deterministic manifest and typed client.

## Command

```bash
wexts generate -p apps/api -o apps/web/lib/wexts
```

Alias:

```bash
wexts codegen -p apps/api -o apps/web/lib/wexts
```

## Determinism

Services and methods are sorted by name. Generated files should be stable between runs when source metadata has not changed.

## No Services Found

If no decorated services are found, codegen fails with `WEXTS_CODEGEN_NO_SERVICES`.

Fix:

```ts
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return `Hello, ${name}!`;
  }
}
```

Then rerun:

```bash
wexts generate -p apps/api -o apps/web/lib/wexts
```

## Production Rule

Run codegen before production build/start. `wexts start` must not scan source files or generate clients.
