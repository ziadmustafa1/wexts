import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWextsRpcClient, FusionFetcher } from './fetcher';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('FusionFetcher', () => {
    let fetcher: FusionFetcher;

    beforeEach(() => {
        fetcher = new FusionFetcher('https://api.example.com');
        fetchMock.mockReset();
    });

    it('should make a GET request', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        const result = await fetcher.get('/test');
        expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/test', expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
        }));
        expect(result).toEqual({ data: 'test' });
    });

    it('should throw error on non-ok response', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        });

        await expect(fetcher.get('/error')).rejects.toThrow('Fusion API Error: 404 Not Found');
    });

    it('creates an RPC client that exposes generated services and calls the correct endpoint', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: 'Hello, Bob!' }),
        });

        const client = createWextsRpcClient({
            schemaVersion: 1,
            services: [{
                name: 'hello',
                className: 'HelloService',
                importPath: 'src/hello.service',
                requireAuth: false,
                methods: [{
                    name: 'sayHello',
                    handlerName: 'sayHello',
                    requireAuth: false,
                    parameters: [{ name: 'name', type: 'string', optional: false }],
                    returnType: 'string',
                }],
            }],
        }, {
            baseUrl: '/rpc',
            fetch: fetchMock,
        });

        await expect(client.hello.sayHello('Bob')).resolves.toBe('Hello, Bob!');
        expect(fetchMock).toHaveBeenCalledWith('/rpc/hello/sayHello', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ args: ['Bob'] }),
        }));
    });

    it('fails clearly for unknown generated services', () => {
        const client = createWextsRpcClient({
            schemaVersion: 1,
            services: [{
                name: 'hello',
                className: 'HelloService',
                importPath: 'src/hello.service',
                requireAuth: false,
                methods: [],
            }],
        });

        expect(() => client.missing.sayHello('Bob')).toThrow('Wexts RPC service not found: missing');
    });
});
