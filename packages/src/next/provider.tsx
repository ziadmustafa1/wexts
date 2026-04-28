'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { createWextsRpcClient, FusionFetcher, WextsRpcClient } from '../client/fetcher';

interface FusionContextType {
    client: FusionFetcher;
    wexts: WextsRpcClient;
}

const FusionContext = createContext<FusionContextType | null>(null);

export interface FusionProviderProps {
    children: ReactNode;
    baseUrl?: string;
    rpcBaseUrl?: string;
    rpcClient?: object;
}

/**
 * FusionProvider - Provides API client to React components
 * Usage:
 * ```tsx
 * <FusionProvider baseUrl="/api">
 *   <App />
 * </FusionProvider>
 * ```
 */
export function FusionProvider({ children, baseUrl = '/api', rpcBaseUrl = '/rpc', rpcClient }: FusionProviderProps) {
    const client = React.useMemo(() => new FusionFetcher(baseUrl), [baseUrl]);
    const wexts = React.useMemo(
        () => (rpcClient as WextsRpcClient | undefined) ?? createWextsRpcClient(undefined, { baseUrl: rpcBaseUrl }),
        [rpcBaseUrl, rpcClient]
    );

    return (
        <FusionContext.Provider value={{ client, wexts }}>
            {children}
        </FusionContext.Provider>
    );
}

/**
 * useFusion hook - Access API client in components
 * Usage:
 * ```tsx
 * const { client } = useFusion();
 * const data = await client.get('/users');
 * ```
 */
export function useFusion(): FusionContextType {
    const context = useContext(FusionContext);
    if (!context) {
        throw new Error('useFusion must be used within FusionProvider');
    }
    return context;
}

export function useWexts<TClient = WextsRpcClient>(): TClient {
    const context = useFusion();
    return context.wexts as TClient;
}
