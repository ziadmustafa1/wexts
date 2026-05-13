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
    rootDir?: string;
    runtimeConfigPath?: string;
}

const DEFAULT_RUNTIME_CONFIG = './wexts.runtime.js';

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
            rootDir = process.cwd(),
            runtimeConfigPath = DEFAULT_RUNTIME_CONFIG,
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

        const absoluteRuntimeConfigPath = path.isAbsolute(runtimeConfigPath)
            ? runtimeConfigPath
            : path.join(path.resolve(rootDir), runtimeConfigPath);
        if (!fs.existsSync(absoluteRuntimeConfigPath)) {
            throw new Error(`Runtime config not found: ${absoluteRuntimeConfigPath}. Create wexts.runtime.js or pass --config.`);
        }

        const processes = this.createProcessConfigs({
            apiPath,
            webPath,
            webPort,
            apiPort,
            rootDir,
            runtimeConfigPath,
        });

        // Start processes
        await this.processRunner.run(processes);

        // Log info
        logger.info('╔═══════════════════════════════════════╗');
        logger.info('║   Fusion Development Server Ready    ║');
        logger.info('╚═══════════════════════════════════════╝\n');
        logger.info(`🌐 Web + RPC:  http://localhost:${webPort}`);
        logger.info(`🔌 API compiler: ${path.resolve(apiPath)}`);
        logger.info('\n');
    }

    createProcessConfigs(config: Required<Pick<DevServerConfig, 'apiPath' | 'webPath' | 'webPort' | 'apiPort' | 'rootDir' | 'runtimeConfigPath'>>): ProcessConfig[] {
        const apiPath = path.resolve(config.apiPath);
        const webPath = path.resolve(config.webPath);
        const rootDir = path.resolve(config.rootDir);
        const runtimeConfigPath = path.isAbsolute(config.runtimeConfigPath)
            ? config.runtimeConfigPath
            : path.join(rootDir, config.runtimeConfigPath);

        return [
            this.createApiCompilerProcess(apiPath, config.apiPort, rootDir),
            {
                name: 'Web',
                command: 'pnpm',
                args: ['exec', 'wexts', 'start', '-c', runtimeConfigPath, '-p', config.webPort.toString(), '--dev'],
                cwd: rootDir,
                color: 'green',
                env: {
                    NEXT_PUBLIC_API_URL: `http://localhost:${config.apiPort}`,
                    WEXTS_WEB_DIR: webPath,
                },
            },
        ];
    }

    private createApiCompilerProcess(apiPath: string, apiPort: number, rootDir: string): ProcessConfig {
        if (fs.existsSync(path.join(apiPath, 'package.json'))) {
            return {
                name: 'API',
                command: 'pnpm',
                args: ['run', 'start:dev'],
                cwd: apiPath,
                color: 'cyan',
                env: {
                    PORT: apiPort.toString(),
                },
            };
        }

        return {
            name: 'API',
            command: 'pnpm',
            args: ['exec', 'tsc', '-w', '-p', path.join(apiPath, 'tsconfig.json')],
            cwd: rootDir,
            color: 'cyan',
            env: {
                PORT: apiPort.toString(),
            },
        };
    }

    stop(): void {
        this.processRunner.stopAll();
    }
}
