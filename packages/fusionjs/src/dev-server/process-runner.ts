import { spawn, ChildProcess } from 'child_process';
import { logger } from '../core/logger';
import * as pc from 'picocolors';

export interface ProcessConfig {
    name: string;
    command: string;
    args: string[];
    cwd: string;
    color: 'cyan' | 'green' | 'yellow' | 'magenta' | 'blue';
    env?: Record<string, string>;
}

/**
 * Run multiple processes concurrently with colored output
 */
export class ProcessRunner {
    private processes: Map<string, ChildProcess> = new Map();
    private colors = {
        cyan: pc.cyan,
        green: pc.green,
        yellow: pc.yellow,
        magenta: pc.magenta,
        blue: pc.blue,
    };

    async run(configs: ProcessConfig[]): Promise<void> {
        logger.info('🚀 Starting development servers...\n');

        for (const config of configs) {
            this.startProcess(config);
        }

        // Handle graceful shutdown
        process.on('SIGINT', () => this.stopAll());
        process.on('SIGTERM', () => this.stopAll());
    }

    private startProcess(config: ProcessConfig): void {
        const { name, command, args, cwd, color, env } = config;

        const colorFn = this.colors[color];
        const prefix = colorFn(`[${name}]`);

        logger.info(`${prefix} Starting...`);

        const proc = spawn(command, args, {
            cwd,
            stdio: 'pipe',
            shell: true,
            env: { ...process.env, ...env },
        });

        this.processes.set(name, proc);

        // Handle stdout
        proc.stdout?.on('data', (data) => {
            const lines = data.toString().split('\n').filter((l: string) => l.trim());
            lines.forEach((line: string) => {
                console.log(`${prefix} ${line}`);
            });
        });

        // Handle stderr
        proc.stderr?.on('data', (data) => {
            const lines = data.toString().split('\n').filter((l: string) => l.trim());
            lines.forEach((line: string) => {
                console.error(`${prefix} ${pc.red(line)}`);
            });
        });

        // Handle exit
        proc.on('exit', (code) => {
            if (code !== 0 && code !== null) {
                logger.error(`${prefix} Exited with code ${code}`);
            }
            this.processes.delete(name);
        });

        // Handle errors
        proc.on('error', (error) => {
            logger.error(`${prefix} Error:`, error.message);
        });
    }

    stopAll(): void {
        logger.info('\n🛑 Stopping all processes...');

        for (const [name, proc] of this.processes.entries()) {
            logger.info(`Stopping ${name}...`);
            proc.kill('SIGTERM');
        }

        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }

    isRunning(name: string): boolean {
        return this.processes.has(name);
    }
}
