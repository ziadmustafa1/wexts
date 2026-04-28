/**
 * Vercel / serverless handler adapter for the Wexts runtime.
 *
 * Creates a standard Node.js (req, res) handler that delegates to the
 * Fastify-backed Wexts runtime **without** calling fastify.listen().
 *
 * Usage:
 *   const handler = await createWextsHandler({ ... });
 *   export default handler;           // Vercel function entry
 */

import type { IncomingMessage, ServerResponse } from 'http';
import type { WextsRuntimeConfig } from './server';
import { createWextsRuntimeServer } from './server';

export type WextsHandler = (req: IncomingMessage, res: ServerResponse) => void;

/**
 * Build a serverless-compatible handler from the Wexts runtime.
 * The returned function accepts Node http (req, res) and passes them
 * into the Fastify instance without ever calling listen().
 */
export async function createWextsHandler(
    config: WextsRuntimeConfig = {},
): Promise<WextsHandler> {
    const server = await createWextsRuntimeServer({
        ...config,
        // Serverless does not use long-lived logging
        logger: config.logger ?? false,
    });

    // Fastify exposes a raw Node handler via server.server (the http.Server)
    // But we need to call .ready() first so all plugins are loaded.
    await server.fastify.ready();

    return (req: IncomingMessage, res: ServerResponse) => {
        server.fastify.server.emit('request', req, res);
    };
}
