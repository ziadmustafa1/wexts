'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { FusionFetcher } from '../client/fetcher';

interface FusionContextType {
    client: FusionFetcher;
}

const FusionContext = createContext<FusionContextType | null>(null);

export interface FusionProviderProps {
    children: ReactNode;
    baseUrl?: string;
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
export function FusionProvider({ children, baseUrl = '/api' }: FusionProviderProps) {
    const client = React.useMemo(() => new FusionFetcher(baseUrl), [baseUrl]);

    return (
        <FusionContext.Provider value={{ client }}>
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
