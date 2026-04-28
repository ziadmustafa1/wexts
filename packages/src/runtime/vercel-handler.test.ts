import { describe, expect, it } from 'vitest';
import { createWextsHandler } from './vercel-handler';
import * as http from 'http';

describe('vercel-handler', () => {
    it('creates a handler function without calling listen()', async () => {
        const handler = await createWextsHandler({
            // Minimal config — no Next.js, no NestJS, no RPC
            logger: false,
        });

        expect(typeof handler).toBe('function');
    });

    it('responds to health check via the handler', async () => {
        const handler = await createWextsHandler({
            logger: false,
        });

        // Simulate an HTTP request using Node's http module
        const response = await new Promise<{ statusCode: number; body: string }>((resolve) => {
            const server = http.createServer(handler);
            server.listen(0, () => {
                const addr = server.address();
                if (!addr || typeof addr === 'string') throw new Error('bad addr');

                http.get(`http://127.0.0.1:${addr.port}/health`, (res) => {
                    let body = '';
                    res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
                    res.on('end', () => {
                        server.close();
                        resolve({ statusCode: res.statusCode ?? 0, body });
                    });
                });
            });
        });

        expect(response.statusCode).toBe(200);
        const parsed = JSON.parse(response.body);
        expect(parsed).toEqual({ ok: true, runtime: 'wexts' });
    });
});
