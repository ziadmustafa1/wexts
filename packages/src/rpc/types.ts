export type RpcAuthPolicy = 'public' | 'required';

export interface RpcParameterManifest {
    name: string;
    type: string;
    optional: boolean;
}

export interface RpcMethodManifest {
    name: string;
    handlerName: string;
    requireAuth: boolean;
    parameters: RpcParameterManifest[];
    returnType: string;
}

export interface RpcServiceManifest {
    name: string;
    className: string;
    importPath: string;
    requireAuth: boolean;
    methods: RpcMethodManifest[];
}

export interface RpcManifest {
    schemaVersion: 1;
    services: RpcServiceManifest[];
}

export interface RpcInvocationRequest {
    args: unknown[];
}

export interface RpcInvocationResponse<T = unknown> {
    data: T;
}
