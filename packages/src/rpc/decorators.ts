import 'reflect-metadata';
import type { RpcAuthPolicy } from './types';

const RPC_SERVICE_KEY = 'wexts:rpc:service';
const RPC_METHODS_KEY = 'wexts:rpc:methods';

export interface RpcServiceOptions {
    name?: string;
    requireAuth?: boolean;
}

export interface RpcMethodOptions {
    name?: string;
    requireAuth?: boolean;
}

export interface RuntimeRpcServiceMetadata {
    name?: string;
    requireAuth: boolean;
}

export interface RuntimeRpcMethodMetadata {
    propertyKey: string | symbol;
    name?: string;
    requireAuth?: boolean;
}

export function RpcService(nameOrOptions?: string | RpcServiceOptions): ClassDecorator {
    const options = normalizeServiceOptions(nameOrOptions);

    return (target) => {
        Reflect.defineMetadata(RPC_SERVICE_KEY, options, target);
        return target;
    };
}

export function RpcMethod(nameOrOptions?: string | RpcMethodOptions): MethodDecorator {
    const options = normalizeMethodOptions(nameOrOptions);

    return (target, propertyKey) => {
        const constructor = target.constructor;
        const methods: RuntimeRpcMethodMetadata[] = Reflect.getMetadata(RPC_METHODS_KEY, constructor) || [];
        const nextMethods = methods.filter((method) => method.propertyKey !== propertyKey);
        nextMethods.push({ propertyKey, ...options });
        Reflect.defineMetadata(RPC_METHODS_KEY, nextMethods, constructor);
    };
}

export function RequireAuth(): MethodDecorator & ClassDecorator {
    return (target: object, propertyKey?: string | symbol) => {
        if (propertyKey) {
            RpcMethod({ requireAuth: true })(target, propertyKey, Object.getOwnPropertyDescriptor(target, propertyKey)!);
            return;
        }

        const existing = getRuntimeRpcServiceMetadata(target as Function);
        Reflect.defineMetadata(RPC_SERVICE_KEY, { ...existing, requireAuth: true }, target);
    };
}

export function getRuntimeRpcServiceMetadata(target: Function): RuntimeRpcServiceMetadata | undefined {
    return Reflect.getMetadata(RPC_SERVICE_KEY, target);
}

export function getRuntimeRpcMethodsMetadata(target: Function): RuntimeRpcMethodMetadata[] {
    return Reflect.getMetadata(RPC_METHODS_KEY, target) || [];
}

export function getRpcAuthPolicy(requireAuth?: boolean): RpcAuthPolicy {
    return requireAuth ? 'required' : 'public';
}

export const WextsRpcService = RpcService;
export const WextsRpc = RpcMethod;

function normalizeServiceOptions(input?: string | RpcServiceOptions): RuntimeRpcServiceMetadata {
    if (typeof input === 'string') {
        return { name: input, requireAuth: false };
    }

    return {
        name: input?.name,
    requireAuth: input?.requireAuth ?? true,
    };
}

function normalizeMethodOptions(input?: string | RpcMethodOptions): RpcMethodOptions {
    if (typeof input === 'string') {
        return { name: input };
    }

    return input ?? {};
}
