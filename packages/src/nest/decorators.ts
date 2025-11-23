// NestJS Integration - Decorators for wexts
// These decorators add metadata for auto API client generation

import 'reflect-metadata';

export interface FusionRouteMetadata {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    responseType?: string;
    requestType?: string;
}

const FUSION_METADATA_KEY = 'fusion:routes';

/**
 * Mark a NestJS controller for Fusion codegen
 * Usage: @FusionController('users')
 */
export function FusionController(prefix: string = ''): ClassDecorator {
    return function (target: any) {
        Reflect.defineMetadata('fusion:controller', { prefix }, target);
        return target;
    };
}

/**
 * Mark a route for API client generation
 * Usage: @FusionRoute({ method: 'GET', path: '/:id' })
 */
export function FusionRoute(metadata: FusionRouteMetadata): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const routes = Reflect.getMetadata(FUSION_METADATA_KEY, target.constructor) || [];
        routes.push({
            ...metadata,
            handler: propertyKey,
        });
        Reflect.defineMetadata(FUSION_METADATA_KEY, routes, target.constructor);
        return descriptor;
    };
}

/**
 * Helper decorators for common HTTP methods
 */
export function FusionGet(path: string = ''): MethodDecorator {
    return FusionRoute({ method: 'GET', path });
}

export function FusionPost(path: string = ''): MethodDecorator {
    return FusionRoute({ method: 'POST', path });
}

export function FusionPut(path: string = ''): MethodDecorator {
    return FusionRoute({ method: 'PUT', path });
}

export function FusionDelete(path: string = ''): MethodDecorator {
    return FusionRoute({ method: 'DELETE', path });
}

/**
 * Get Fusion metadata from a controller
 */
export function getFusionMetadata(controller: any): {
    controller: any;
    routes: any[];
} {
    return {
        controller: Reflect.getMetadata('fusion:controller', controller),
        routes: Reflect.getMetadata(FUSION_METADATA_KEY, controller) || [],
    };
}
