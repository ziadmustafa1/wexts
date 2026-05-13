import type { RpcManifest, RpcInvocationResponse } from '../rpc/types';
import { WextsRpcError } from '../errors';

export class FusionFetcher {
    private baseUrl: string;

    constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(method: string, path: string, body?: any): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Automatically attach Fusion Token if present
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('fusion_token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new WextsRpcError({
                code: 'WEXTS_API_REQUEST_FAILED',
                message: `Fusion API Error: ${response.status} ${response.statusText}`,
                suggestedFix: 'Check the API route, server logs, and authentication headers.',
                docsSlug: 'troubleshooting',
            });
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return response.json();
    }

    get<T>(path: string) { return this.request<T>('GET', path); }
    post<T>(path: string, body: any) { return this.request<T>('POST', path, body); }
    put<T>(path: string, body: any) { return this.request<T>('PUT', path, body); }
    delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const apiFetcher = new FusionFetcher();

export interface WextsRpcClientOptions {
    baseUrl?: string;
    fetch?: typeof fetch;
    getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
}

export type WextsRpcClient = Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>;

export function createWextsRpcClient(
    manifest: Pick<RpcManifest, 'services'> | undefined,
    options: WextsRpcClientOptions = {}
): WextsRpcClient {
    const hasManifest = Boolean(manifest);
    const services = new Set((manifest?.services ?? []).map((service) => service.name));
    const methodMap = new Map<string, Set<string>>();

    for (const service of manifest?.services ?? []) {
        methodMap.set(service.name, new Set(service.methods.map((method) => method.name)));
    }

    const createServiceProxy = (serviceName: string) => new Proxy({}, {
        get(_target, methodName) {
            if (typeof methodName !== 'string') return undefined;
            if (methodName === 'then') return undefined;

            const knownMethods = methodMap.get(serviceName);
            if (knownMethods && !knownMethods.has(methodName)) {
                throw new WextsRpcError({
                    code: 'WEXTS_RPC_METHOD_NOT_FOUND',
                    message: `Wexts RPC method not found: ${serviceName}.${methodName}`,
                    suggestedFix: 'Run `wexts generate` and verify the method is decorated with @RpcMethod().',
                    docsSlug: 'rpc',
                });
            }

            return (...args: unknown[]) => invokeRpc(serviceName, methodName, args, options);
        },
    }) as Record<string, (...args: unknown[]) => Promise<unknown>>;

    return new Proxy({}, {
        get(_target, serviceName) {
            if (typeof serviceName !== 'string') return undefined;
            if (serviceName === 'then') return undefined;
            if (!hasManifest) {
                throw new WextsRpcError({
                    code: 'WEXTS_RPC_MANIFEST_MISSING',
                    message: 'Wexts RPC manifest is missing.',
                    suggestedFix: 'Run `wexts generate` and import the generated client/provider instead of creating an empty client.',
                    docsSlug: 'codegen',
                });
            }
            if (!services.has(serviceName)) {
                throw new WextsRpcError({
                    code: 'WEXTS_RPC_SERVICE_NOT_FOUND',
                    message: `Wexts RPC service not found: ${serviceName}`,
                    suggestedFix: 'Run `wexts generate` and verify the service is decorated with @RpcService().',
                    docsSlug: 'rpc',
                });
            }

            return createServiceProxy(serviceName);
        },
    }) as WextsRpcClient;
}

async function invokeRpc(
    serviceName: string,
    methodName: string,
    args: unknown[],
    options: WextsRpcClientOptions
): Promise<unknown> {
    const fetchImpl = options.fetch ?? fetch;
    const baseUrl = options.baseUrl ?? '/rpc';
    const headers = {
        'Content-Type': 'application/json',
        ...(await options.getHeaders?.() ?? {}),
    };
    const response = await fetchImpl(`${baseUrl}/${encodeURIComponent(serviceName)}/${encodeURIComponent(methodName)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ args }),
    });

    if (!response.ok) {
        throw new WextsRpcError({
            code: 'WEXTS_RPC_REQUEST_FAILED',
            message: `Wexts RPC Error: ${response.status} ${response.statusText}`,
            suggestedFix: 'Check the RPC route, service policy, and server logs.',
            docsSlug: 'troubleshooting',
        });
    }

    const payload = await response.json() as RpcInvocationResponse;
    return payload.data;
}
