# RPC

Wexts RPC is explicit. A backend service is exposed only when it uses Wexts RPC decorators.

## Backend Service

```ts
import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return `Hello, ${name}!`;
  }
}
```

## Generate Client

```bash
wexts generate -p apps/api -o apps/web/lib/wexts
```

Generated files:

```text
apps/web/lib/wexts/client.ts
apps/web/lib/wexts/index.ts
apps/web/lib/wexts/wexts.rpc.manifest.json
```

## Frontend Call

```ts
import { useWexts } from 'wexts/next';

const wexts = useWexts();
await wexts.hello.sayHello('Bob');
```

## Auth Policy

Set `requireAuth: true` on the service or method. The runtime maps generated RPC metadata into route policies before registering RPC routes.

```ts
@RpcService({ name: 'account', requireAuth: true })
export class AccountService {}
```

## Failure Cases

- Missing manifest: `WEXTS_RPC_MANIFEST_MISSING`
- Missing service: `WEXTS_RPC_SERVICE_NOT_FOUND`
- Missing method: `WEXTS_RPC_METHOD_NOT_FOUND`
- Failed request: `WEXTS_RPC_REQUEST_FAILED`
