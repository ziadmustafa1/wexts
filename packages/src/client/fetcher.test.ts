import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWextsRpcClient, FusionFetcher } from './fetcher';
import { WextsRpcError } from '../errors';

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

        await expect(fetcher.get('/error')).rejects.toMatchObject({
            code: 'WEXTS_API_REQUEST_FAILED',
            message: 'Fusion API Error: 404 Not Found',
        });
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

    it('fails clearly when the RPC manifest is missing', () => {
        const client = createWextsRpcClient(undefined);

        expect(() => client.hello.sayHello('Bob')).toThrow(WextsRpcError);
        expect(() => client.hello.sayHello('Bob')).toThrow('Wexts RPC manifest is missing.');
    });

    it('fails clearly for unknown generated methods', () => {
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

        expect(() => client.hello.missing('Bob')).toThrow('Wexts RPC method not found: hello.missing');
    });

    it('includes an RPC error code when the endpoint fails', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
        });

        const client = createWextsRpcClient({
            schemaVersion: 1,
            services: [{
                name: 'hello',
                className: 'HelloService',
                importPath: 'src/hello.service',
                requireAuth: true,
                methods: [{
                    name: 'sayHello',
                    handlerName: 'sayHello',
                    requireAuth: true,
                    parameters: [{ name: 'name', type: 'string', optional: false }],
                    returnType: 'string',
                }],
            }],
        }, {
            fetch: fetchMock,
        });

        await expect(client.hello.sayHello('Bob')).rejects.toMatchObject({
            code: 'WEXTS_RPC_REQUEST_FAILED',
        });
    });
});
