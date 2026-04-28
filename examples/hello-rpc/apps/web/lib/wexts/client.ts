import { createWextsRpcClient, type WextsRpcClientOptions } from 'wexts/client';
import type { RpcManifest } from 'wexts/rpc';

const manifest = {
  "schemaVersion": 1,
  "services": [
    {
      "name": "hello",
      "className": "HelloService",
      "importPath": "src/hello.service",
      "requireAuth": false,
      "methods": [
        {
          "name": "sayHello",
          "handlerName": "sayHello",
          "requireAuth": false,
          "parameters": [
            {
              "name": "name",
              "type": "string",
              "optional": false
            }
          ],
          "returnType": "Promise<string>"
        }
      ]
    }
  ]
} satisfies RpcManifest;

export interface WextsClient {
  hello: {
    sayHello: (name: string) => Promise<string>;
  };
}


export function createWextsClient(options?: WextsRpcClientOptions): WextsClient {
  return createWextsRpcClient(manifest, options) as unknown as WextsClient;
}

export const wexts = createWextsClient();
