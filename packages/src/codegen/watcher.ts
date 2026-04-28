import * as chokidar from 'chokidar';
import { logger } from '../core/logger';
import { generateRpcClient } from './generator';

export interface WatchOptions {
    projectPath: string;
    outputPath: string;
    pattern?: string;
}

/**
 * Watch NestJS controllers and regenerate client on changes
 */
export class CodegenWatcher {
    private watcher: chokidar.FSWatcher | null = null;

    async watch(options: WatchOptions): Promise<void> {
        const { projectPath, outputPath, pattern = '**/*.controller.ts' } = options;

        logger.info('👀 Watching for controller changes...');

        // Initial generation
        await this.generateClient(projectPath, outputPath);

        // Watch for changes
        this.watcher = chokidar.watch(pattern, {
            cwd: projectPath,
            ignored: /node_modules/,
            persistent: true,
        });

        this.watcher.on('change', async (path) => {
            logger.info(`📝 Controller changed: ${path}`);
            await this.generateClient(projectPath, outputPath);
        });

        this.watcher.on('add', async (path) => {
            logger.info(`➕ New controller: ${path}`);
            await this.generateClient(projectPath, outputPath);
        });

        this.watcher.on('unlink', async (path) => {
            logger.info(`➖ Controller removed: ${path}`);
            await this.generateClient(projectPath, outputPath);
        });
    }

    async stop(): Promise<void> {
        if (this.watcher) {
            await this.watcher.close();
            this.watcher = null;
        }
    }

    private async generateClient(projectPath: string, outputPath: string): Promise<void> {
        try {
            const manifest = await generateRpcClient({ projectPath, outputPath });
            logger.success(`Generated client for ${manifest.services.length} RPC service(s)`);
        } catch (error: any) {
            logger.error('Failed to generate client:', error.message);
        }
    }
}
