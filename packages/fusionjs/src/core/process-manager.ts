import { FusionFetcher } from './client/fetcher';

export class ProcessManager {
    /**
     * Setup process error handlers
     */
    static initialize(): void {
        process.on('uncaughtException', (error) => {
            console.error('[Fusion] Uncaught Exception:', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('[Fusion] Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('SIGTERM', () => {
            console.log('[Fusion] SIGTERM received, shutting down gracefully');
            process.exit(0);
        });

        process.on('SIGINT', () => {
            console.log('[Fusion] SIGINT received, shutting down gracefully');
            process.exit(0);
        });
    }

    /**
     * Graceful shutdown helper
     */
    static async shutdown(cleanup: () => Promise<void>): Promise<void> {
        try {
            await cleanup();
            process.exit(0);
        } catch (error) {
            console.error('[Fusion] Error during shutdown:', error);
            process.exit(1);
        }
    }
}
