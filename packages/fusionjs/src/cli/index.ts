#!/usr/bin/env node

import { Command } from 'commander';
import { logger } from '../core/logger';
import * as pc from 'picocolors';

const program = new Command();

program
    .name('fusion')
    .description('wexts - Full-stack framework CLI')
    .version('1.0.0');

// Create Command
program
    .command('create <project-name>')
    .description('Create a new wexts project')
    .option('-t, --template <template>', 'Template to use (monorepo|api|web)', 'monorepo')
    .action(async (projectName: string, options: any) => {
        logger.info(pc.cyan(`Creating wexts project: ${pc.bold(projectName)}`));
        logger.info(`Template: ${options.template}`);

        // TODO: Implement project scaffolding
        logger.warn('Project scaffolding not yet implemented');
        logger.info('Will create:');
        logger.info('  • apps/api/ (NestJS 10)');
        logger.info('  • apps/web/ (Next.js 16)');
        logger.info('  • packages/types/');
        logger.info('  • packages/api-client/');
    });

// Dev Command
program
    .command('dev')
    .description('Start development servers')
    .option('-a, --api <path>', 'Path to API project', './apps/api')
    .option('-w, --web <path>', 'Path to Web project', './apps/web')
    .option('-p, --port <port>', 'Port for web server', '3000')
    .option('--api-port <port>', 'Port for API server', '5050')
    .option('--no-proxy', 'Disable proxy server')
    .action(async (options: any) => {
        logger.info(pc.green('🚀 Starting Fusion development servers...\n'));

        const { DevServer } = await import('../dev-server/index.js');
        const server = new DevServer.FusionDevServer();

        try {
            await server.start({
                apiPath: options.api,
                webPath: options.web,
                webPort: parseInt(options.port),
                apiPort: parseInt(options.apiPort),
                useProxy: options.proxy,
            });
        } catch (error: any) {
            logger.error('Failed to start dev server:', error.message);
            process.exit(1);
        }
    });

// Build Command
program
    .command('build')
    .description('Build for production')
    .action(async () => {
        logger.info(pc.blue('Building Fusion project...'));

        // TODO: Build logic
        logger.warn('Build not yet implemented');
    });

// Generate Command
program
    .command('generate <type> <name>')
    .alias('g')
    .description('Generate code (controller|module|page)')
    .action(async (type: string, name: string) => {
        logger.info(pc.magenta(`Generating ${type}: ${name}`));

        // TODO: Code generation
        logger.warn('Code generation not yet implemented');
    });

// Codegen Command
program
    .command('codegen')
    .description('Generate API client from NestJS controllers')
    .option('-w, --watch', 'Watch mode - regenerate on changes')
    .option('-p, --project <path>', 'Path to NestJS project', './apps/api')
    .option('-o, --output <path>', 'Output path for generated client', './packages/api-client/src')
    .action(async (options: any) => {
        const { Codegen } = await import('../codegen/index.js');

        if (options.watch) {
            logger.info(pc.cyan('Starting codegen in watch mode...'));
            const watcher = new Codegen.CodegenWatcher();
            await watcher.watch({
                projectPath: options.project,
                outputPath: options.output,
            });
        } else {
            logger.info(pc.cyan('Generating API client...'));
            const parser = new Codegen.NestJSParser(options.project);
            const controllers = parser.findFusionControllers();

            const generator = new Codegen.ClientGenerator();
            await generator.generate({
                controllers,
                outputPath: options.output,
            });
        }
    });

program.parse();
