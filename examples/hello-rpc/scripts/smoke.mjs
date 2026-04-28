const baseUrl = process.env.WEXTS_SMOKE_URL ?? 'http://localhost:3000';

const health = await fetch(`${baseUrl}/health`);
if (!health.ok) {
  throw new Error(`/health failed with ${health.status}`);
}

const rpc = await fetch(`${baseUrl}/rpc/hello/sayHello`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ args: ['Bob'] }),
});

if (!rpc.ok) {
  throw new Error(`/rpc/hello/sayHello failed with ${rpc.status}`);
}

const payload = await rpc.json();
if (payload.data !== 'Hello, Bob!') {
  throw new Error(`Unexpected RPC payload: ${JSON.stringify(payload)}`);
}

console.log('hello-rpc smoke passed');
