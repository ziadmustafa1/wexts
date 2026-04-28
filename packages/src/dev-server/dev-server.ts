import { ProcessRunner, ProcessConfig } from './process-runner';
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

    constructor() {
        this.processRunner = new ProcessRunner();
    }

    async start(config: DevServerConfig): Promise<void> {
        const {
            apiPath,
            webPath,
            webPort = 3000,
            apiPort = 5050,
            useProxy = false,
        } = config;

        if (useProxy) {
            throw new Error('The legacy dev proxy is disabled because it conflicts with the Next.js port. Use the production runtime for single-port serving.');
        }

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
                NEXT_PUBLIC_API_URL: `http://localhost:${apiPort}`,
            },
        });

        // Start processes
        await this.processRunner.run(processes);

        // Log info
        logger.info('╔═══════════════════════════════════════╗');
        logger.info('║   Fusion Development Server Ready    ║');
        logger.info('╚═══════════════════════════════════════╝\n');
        logger.info(`🌐 Web:  http://localhost:${webPort}`);
        logger.info(`🔌 API:  http://localhost:${apiPort}`);
        logger.info('\n');
    }

    stop(): void {
        this.processRunner.stopAll();
    }
}
