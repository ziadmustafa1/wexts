import * as fs from 'fs';
import * as path from 'path';
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { registerWextsShield, type WextsShieldConfig, type WextsShieldRoutePolicy } from '@wexts/security';
import type { RpcManifest } from '../rpc/types';
import { registerRpcRoutes, type RpcServiceInstances } from './rpc-router';

export interface WextsRuntimeConfig {
    rootDir?: string;
    port?: number;
    host?: string;
    dev?: boolean;
    nextDir?: string;
    nestAppModule?: unknown;
    nestAppModulePath?: string;
    rpcManifest?: RpcManifest;
    rpcManifestPath?: string;
    rpcServices?: RpcServiceInstances;
    security?: WextsShieldConfig;
    logger?: FastifyServerOptions['logger'];
}

export interface WextsRuntimeServer {
    fastify: FastifyInstance;
    start: () => Promise<void>;
    close: () => Promise<void>;
}

export async function createWextsRuntimeServer(config: WextsRuntimeConfig = {}): Promise<WextsRuntimeServer> {
    const rootDir = path.resolve(config.rootDir ?? process.cwd());
    const fastify = Fastify({
        logger: config.logger ?? true,
        bodyLimit: config.security?.bodyLimitBytes ?? 1_048_576,
        requestTimeout: config.security?.requestTimeoutMs ?? 30_000,
    });

    const manifest = config.rpcManifest ?? loadJson<RpcManifest>(rootDir, config.rpcManifestPath);
    const routePolicies = [
        ...(config.security?.routePolicies ?? []),
        ...rpcPoliciesFromManifest(manifest),
    ];

    await registerWextsShield(fastify, {
        ...config.security,
        routePolicies,
    });

    fastify.get('/health', async () => ({
        ok: true,
        runtime: 'wexts',
    }));

    fastify.get('/api/health', async () => ({
        ok: true,
        runtime: 'wexts',
        scope: 'api',
    }));

    if (manifest && config.rpcServices) {
        await registerRpcRoutes(fastify, {
            manifest,
            services: config.rpcServices,
            authorize: (request) => Boolean(request.headers.authorization || request.headers.cookie),
        });
    }

    if (config.nestAppModule || config.nestAppModulePath) {
        await mountNest(fastify, rootDir, config);
    }

    if (config.nextDir) {
        await mountNext(fastify, rootDir, config);
    }

    const start = async () => {
        await fastify.listen({
            port: config.port ?? Number(process.env.PORT ?? 3000),
            host: config.host ?? '0.0.0.0',
        });
    };

    const close = async () => {
        await fastify.close();
    };

    registerShutdown(close);

    return {
        fastify,
        start,
        close,
    };
}

export async function startWextsRuntime(config: WextsRuntimeConfig = {}): Promise<WextsRuntimeServer> {
    const server = await createWextsRuntimeServer(config);
    await server.start();
    return server;
}

function rpcPoliciesFromManifest(manifest?: RpcManifest): WextsShieldRoutePolicy[] {
    if (!manifest) return [];

    return manifest.services.flatMap((service) => service.methods.map((method) => ({
        path: `/rpc/${service.name}/${method.name}`,
        methods: ['POST'],
        mode: service.requireAuth || method.requireAuth ? 'requireAuth' : 'public',
    })));
}

function loadJson<T>(rootDir: string, filePath?: string): T | undefined {
    if (!filePath) return undefined;

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
    if (!fs.existsSync(absolutePath)) return undefined;
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as T;
}

async function mountNest(fastify: FastifyInstance, rootDir: string, config: WextsRuntimeConfig): Promise<void> {
    const [{ NestFactory }, { FastifyAdapter }] = await Promise.all([
        import('@nestjs/core'),
        import('@nestjs/platform-fastify'),
    ]);
    const AppModule = config.nestAppModule ?? await importModule(rootDir, config.nestAppModulePath!);
    const moduleValue = (AppModule as { AppModule?: unknown }).AppModule ?? AppModule;
    const nestApp = await NestFactory.create(moduleValue as never, new FastifyAdapter(fastify as never), {
        logger: config.dev ? ['log', 'error', 'warn'] : ['error', 'warn'],
    });
    nestApp.setGlobalPrefix('api');
    await nestApp.init();
}

async function mountNext(fastify: FastifyInstance, rootDir: string, config: WextsRuntimeConfig): Promise<void> {
    const nextModule = await import('next') as unknown as { default?: (options: unknown) => { prepare: () => Promise<void>; getRequestHandler: () => (req: unknown, res: unknown) => Promise<void> } };
    const next = nextModule.default;
    if (!next) {
        throw new Error('Next.js could not be loaded. Install next or omit nextDir.');
    }
    const nextApp = next({
        dev: config.dev ?? process.env.NODE_ENV !== 'production',
        dir: path.isAbsolute(config.nextDir!) ? config.nextDir : path.join(rootDir, config.nextDir!),
    });
    await nextApp.prepare();
    const handler = nextApp.getRequestHandler();

    fastify.all('/*', async (request, reply) => {
        await handler(request.raw, reply.raw);
        reply.hijack();
    });
}

async function importModule(rootDir: string, modulePath: string): Promise<unknown> {
    const absolutePath = path.isAbsolute(modulePath) ? modulePath : path.join(rootDir, modulePath);
    return import(pathToFileUrl(absolutePath));
}

function pathToFileUrl(filePath: string): string {
    return `file://${filePath}`;
}

function registerShutdown(close: () => Promise<void>): void {
    const handler = async () => {
        await close();
        process.exit(0);
    };

    process.once('SIGINT', handler);
    process.once('SIGTERM', handler);
}
