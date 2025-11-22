import { ProcessRunner, ProcessConfig } from './process-runner';
import { ProxyServer } from './proxy';
import { logger } from '../core/logger';
import * as path from 'path';
import * as fs from 'fs';

export interface DevServerConfig {
    apiPath: string;
    webPath: string;
    webPort?: number;
    apiPort?: number;
    useProxy?: boolean;
}

/**
 * Unified development server for Fusion projects
 */
export class FusionDevServer {
    private processRunner: ProcessRunner;
    private proxyServer: ProxyServer | null = null;

    constructor() {
        this.processRunner = new ProcessRunner();
    }

    async start(config: DevServerConfig): Promise<void> {
        const {
            apiPath,
            webPath,
            webPort = 3000,
            apiPort = 5050,
            useProxy = true,
        } = config;

        // Validate paths
        if (!fs.existsSync(apiPath)) {
            throw new Error(`API path not found: ${apiPath}`);
        }
        if (!fs.existsSync(webPath)) {
            throw new Error(`Web path not found: ${webPath}`);
        }

        const processes: ProcessConfig[] = [];

        // Add API server
        processes.push({
            name: 'API',
            command: 'npm',
            args: ['run', 'start:dev'],
            cwd: path.resolve(apiPath),
            color: 'cyan',
            env: {
                PORT: apiPort.toString(),
            },
        });

        // Add Web server
        processes.push({
            name: 'Web',
            command: 'npm',
            args: ['run', 'dev', '--', '-p', webPort.toString()],
            cwd: path.resolve(webPath),
            color: 'green',
            env: {
                NEXT_PUBLIC_API_URL: useProxy
                    ? `http://localhost:${webPort}/api`
                    : `http://localhost:${apiPort}`,
            },
        });

        // Start proxy if enabled
        if (useProxy) {
            this.proxyServer = new ProxyServer();

            // Wait a bit for API to be ready
            setTimeout(async () => {
                await this.proxyServer!.start({
                    port: webPort,
                    apiTarget: `http://localhost:${apiPort}`,
                    apiPrefix: '/api',
                });
            }, 3000);
        }

        // Start processes
        await this.processRunner.run(processes);

        // Log info
        logger.info('╔═══════════════════════════════════════╗');
        logger.info('║   Fusion Development Server Ready    ║');
        logger.info('╚═══════════════════════════════════════╝\n');
        logger.info(`🌐 Web:  http://localhost:${webPort}`);
        logger.info(`🔌 API:  http://localhost:${apiPort}`);
        if (useProxy) {
            logger.info(`🔄 Proxy: Enabled (${webPort}/api → ${apiPort})`);
        }
        logger.info('\n');
    }

    stop(): void {
        this.processRunner.stopAll();
        if (this.proxyServer) {
            this.proxyServer.stop();
        }
    }
}
