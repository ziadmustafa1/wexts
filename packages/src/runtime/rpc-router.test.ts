import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';
import { registerRpcRoutes } from './rpc-router';

describe('runtime rpc router', () => {
    it('invokes bound service methods from the generated manifest', async () => {
        const app = Fastify();
        await registerRpcRoutes(app, {
            manifest: {
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
            },
            services: {
                hello: {
                    sayHello: (name: unknown) => `Hello, ${name}!`,
                },
            },
        });

        const response = await app.inject({
            method: 'POST',
            url: '/rpc/hello/sayHello',
            payload: { args: ['Bob'] },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ data: 'Hello, Bob!' });
    });

    it('blocks private RPC when authorization fails', async () => {
        const app = Fastify();
        await registerRpcRoutes(app, {
            manifest: {
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
                        parameters: [],
                        returnType: 'string',
                    }],
                }],
            },
            services: {
                hello: {
                    sayHello: () => 'secret',
                },
            },
            authorize: () => false,
        });

        const response = await app.inject({
            method: 'POST',
            url: '/rpc/hello/sayHello',
            payload: { args: [] },
        });

        expect(response.statusCode).toBe(401);
    });
});
