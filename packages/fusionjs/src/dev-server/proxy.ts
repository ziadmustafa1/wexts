import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { logger } from '../core/logger';
import * as pc from 'picocolors';

export interface ProxyConfig {
    port: number;
    apiTarget: string;
    apiPrefix: string;
}

/**
 * Proxy server to forward API requests from Next.js to NestJS
 */
export class ProxyServer {
    private server: http.Server | null = null;
    private proxy: httpProxy | null = null;

    async start(config: ProxyConfig): Promise<void> {
        const { port, apiTarget, apiPrefix } = config;

        this.proxy = httpProxy.createProxyServer({
            target: apiTarget,
            changeOrigin: true,
            ws: true, // WebSocket support
        });

        // Handle proxy errors
        this.proxy.on('error', (err, req, res) => {
            logger.error('Proxy error:', err.message);
            if (res && !res.headersSent) {
                (res as http.ServerResponse).writeHead(502, { 'Content-Type': 'text/plain' });
                (res as http.ServerResponse).end('Bad Gateway - API server unavailable');
            }
        });

        this.server = http.createServer((req, res) => {
            // Check if request is for API
            if (req.url?.startsWith(apiPrefix)) {
                // Remove prefix before forwarding
                const newUrl = req.url.substring(apiPrefix.length) || '/';
                req.url = newUrl;

                logger.info(pc.gray(`→ ${req.method} ${apiPrefix}${newUrl}`));
                this.proxy!.web(req, res);
            } else {
                // Not an API request - should not happen
                res.writeHead(404);
                res.end('Not Found');
            }
        });

        // Handle WebSocket upgrade
        this.server.on('upgrade', (req, socket, head) => {
            if (req.url?.startsWith(apiPrefix)) {
                const newUrl = req.url.substring(apiPrefix.length) || '/';
                req.url = newUrl;
                this.proxy!.ws(req, socket, head);
            }
        });

        return new Promise((resolve) => {
            this.server!.listen(port, () => {
                logger.success(`✅ Proxy server running on port ${port}`);
                logger.info(`   Forwarding ${pc.cyan(apiPrefix + '/*')} → ${pc.cyan(apiTarget)}\n`);
                resolve();
            });
        });
    }

    stop(): void {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
        if (this.proxy) {
            this.proxy.close();
            this.proxy = null;
        }
    }
}
