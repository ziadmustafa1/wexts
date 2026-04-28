'use client';

import { FusionProvider, useWexts as useGeneratedWexts } from 'wexts/next';
import { createWextsClient, type WextsClient } from './wexts/client';

export function WextsProvider({ children }: { children: React.ReactNode }) {
  return (
    <FusionProvider rpcClient={createWextsClient({ baseUrl: '/rpc' })}>
      {children}
    </FusionProvider>
  );
}

export function useWexts(): WextsClient {
  return useGeneratedWexts<WextsClient>();
}
