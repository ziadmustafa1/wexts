import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { RpcManifest, RpcServiceManifest } from '../rpc/types';

export type RpcServiceInstances = Record<string, Record<string, (...args: unknown[]) => unknown | Promise<unknown>>>;

export interface RegisterRpcRoutesOptions {
    manifest: RpcManifest;
    services: RpcServiceInstances;
    authorize?: (request: FastifyRequest, service: RpcServiceManifest, methodName: string) => boolean | Promise<boolean>;
}

export async function registerRpcRoutes(fastify: FastifyInstance, options: RegisterRpcRoutesOptions): Promise<void> {
    const serviceMap = new Map(options.manifest.services.map((service) => [service.name, service]));

    fastify.post('/rpc/:service/:method', async (request: FastifyRequest<{
        Params: { service: string; method: string };
        Body: { args?: unknown[] };
    }>, reply: FastifyReply) => {
        const service = serviceMap.get(request.params.service);
        if (!service) {
            reply.status(404);
            return { error: 'WEXTS_RPC_SERVICE_NOT_FOUND' };
        }

        const method = service.methods.find((candidate) => candidate.name === request.params.method);
        if (!method) {
            reply.status(404);
            return { error: 'WEXTS_RPC_METHOD_NOT_FOUND' };
        }

        if (method.requireAuth || service.requireAuth) {
            const authorized = await options.authorize?.(request, service, method.name);
            if (!authorized) {
                reply.status(401);
                return { error: 'WEXTS_RPC_AUTH_REQUIRED' };
            }
        }

        const instance = options.services[service.name];
        const handler = instance?.[method.handlerName];
        if (!handler) {
            reply.status(500);
            return { error: 'WEXTS_RPC_HANDLER_NOT_BOUND' };
        }

        const args = Array.isArray(request.body?.args) ? request.body.args : [];
        const data = await handler.apply(instance, args);
        return { data };
    });
}
