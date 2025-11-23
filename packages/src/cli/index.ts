#!/usr/bin/env node

import { Command } from 'commander';
import { logger } from '../core/logger';
import * as pc from 'picocolors';
import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const program = new Command();

program
    .name('wexts')
    .description('Wexts Framework - Next.js 16 + NestJS 11')
    .version('2.0.0');

// Interactive Mode (when no command is provided)
program
    .action(async () => {
        console.log(pc.cyan(`
╔══════════════════════════════════════════╗
║                                          ║
║      ${pc.bold('🚀 Wexts Framework v2.0')}          ║
║                                          ║
║  Next.js 16 + NestJS 11 Full-Stack      ║
║                                          ║
╚══════════════════════════════════════════╝
        `));

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    { name: '📦 Create a new project', value: 'create' },
                    { name: '🚀 Start development server', value: 'dev' },
                    { name: '🔨 Build for production', value: 'build' },
                    { name: '⚡ Generate code', value: 'generate' },
                    { name: '🤖 Generate API client', value: 'codegen' },
                    { name: '❌ Exit', value: 'exit' },
                ],
            },
        ]);

        if (action === 'exit') {
            logger.info('Goodbye! 👋');
            process.exit(0);
        }

        // Route to appropriate command
        if (action === 'create') {
            const { projectName, template } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'Project name:',
                    default: 'my-wexts-app',
                },
                {
                    type: 'list',
                    name: 'template',
                    message: 'Select template:',
                    choices: [
                        { name: '📦 Monorepo (Next.js + NestJS)', value: 'monorepo' },
                        { name: '🎯 API only (NestJS)', value: 'api' },
                        { name: '🌐 Web only (Next.js)', value: 'web' },
                    ],
                },
            ]);

            await createProject(projectName, template);
        } else if (action === 'dev') {
            logger.info(pc.green('🚀 Starting development servers...\n'));
            logger.warn('Dev server not yet implemented');
        } else if (action === 'build') {
            logger.info(pc.blue('🔨 Building project...\n'));
            logger.warn('Build not yet implemented');
        } else if (action === 'generate') {
            const { type, name } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'type',
                    message: 'What to generate?',
                    choices: ['controller', 'module', 'service', 'page'],
                },
                {
                    type: 'input',
                    name: 'name',
                    message: 'Name:',
                },
            ]);
            logger.info(pc.magenta(`\n⚡ Generating ${type}: ${name}\n`));
            logger.warn('Code generation not yet implemented');
        } else if (action === 'codegen') {
            logger.info(pc.cyan('\n🤖 Generating API client...\n'));
            logger.warn('Codegen not yet implemented');
        }
    });

// Create Command
program
    .command('create <project-name>')
    .description('Create a new wexts project')
    .option('-t, --template <template>', 'Template to use (monorepo|api|web)', 'monorepo')
    .action(async (projectName: string, options: any) => {
        await createProject(projectName, options.template);
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
        logger.info(pc.green('🚀 Starting Wexts development servers...\n'));

        const { FusionDevServer } = await import('../dev-server/index.js');
        const server = new FusionDevServer();

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
        logger.info(pc.blue('Building Wexts project...'));

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
        const { NestJSParser, ClientGenerator, CodegenWatcher } = await import('../codegen/index.js');

        if (options.watch) {
            logger.info(pc.cyan('Starting codegen in watch mode...'));
            const watcher = new CodegenWatcher();
            await watcher.watch({
                projectPath: options.project,
                outputPath: options.output,
            });
        } else {
            logger.info(pc.cyan('Generating API client...'));
            const parser = new NestJSParser(options.project);
            const controllers = parser.findFusionControllers();

            const generator = new ClientGenerator();
            await generator.generate({
                controllers,
                outputPath: options.output,
            });
        }
    });

// Helper function for creating project
async function createProject(projectName: string, template: string) {
    logger.info(pc.cyan(`Creating wexts project: ${pc.bold(projectName)}`));
    logger.info(`Template: ${template}`);

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        logger.error(`Directory ${projectName} already exists!`);
        process.exit(1);
    }

    // Helper to resolve template path
    function getTemplatePath(): string {
        // Try multiple locations
        const possiblePaths = [
            path.join(__dirname, '../../templates'), // When running from dist/cli/index.js
            path.join(__dirname, '../templates'),    // Alternative structure
            path.join(process.cwd(), 'templates'),   // Local dev
            path.resolve(__dirname, '..', '..', 'templates') // Absolute resolve
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                return p;
            }
        }
        return '';
    }

    const templatePath = getTemplatePath();

    if (!templatePath) {
        logger.error(`❌ Template directory not found!`);
        logger.info(`Searched in:`);
        logger.info(`  - ${path.join(__dirname, '../../templates')}`);
        logger.info(`  - ${path.join(__dirname, '../templates')}`);
        logger.info(`  - ${path.join(process.cwd(), 'templates')}`);

        // Fallback to basic structure if templates are missing (for dev/test)
        logger.warn('⚠️ Using fallback scaffolding (empty structure)');
        fs.mkdirSync(projectPath, { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'apps'), { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'packages'), { recursive: true });
    } else {
        logger.info(`📦 Copying templates from: ${templatePath}`);

        fs.mkdirSync(projectPath, { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'apps'), { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'packages'), { recursive: true });

        // Copy NestJS API Template
        const apiTemplatePath = path.join(templatePath, 'nestjs-api');
        const apiDestPath = path.join(projectPath, 'apps/api');
        if (fs.existsSync(apiTemplatePath)) {
            fs.cpSync(apiTemplatePath, apiDestPath, { recursive: true });
            logger.success('  - Copied API template');
        } else {
            logger.warn(`  ⚠️ API template not found at ${apiTemplatePath}`);
        }

        // Copy Next.js Web Template
        const webTemplatePath = path.join(templatePath, 'nextjs-web');
        const webDestPath = path.join(projectPath, 'apps/web');
        if (fs.existsSync(webTemplatePath)) {
            fs.cpSync(webTemplatePath, webDestPath, { recursive: true });
            logger.success('  - Copied Web template');
        } else {
            logger.warn(`  ⚠️ Web template not found at ${webTemplatePath}`);
        }
    }

    // Create package.json
    const packageJson = {
        name: projectName,
        version: "0.0.0",
        private: true,
        scripts: {
            "build": "turbo run build",
            "dev": "turbo run dev",
            "lint": "turbo run lint",
            "format": "prettier --write \"**/*.{ts,tsx,md}\""
        },
        devDependencies: {
            "turbo": "latest",
            "prettier": "latest",
            "typescript": "^5.9.3",
            "wexts": "latest"
        },
        packageManager: "pnpm@10.0.0",
        workspaces: [
            "apps/*",
            "packages/*"
        ]
    };

    fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    // Create turbo.json
    const turboJson = {
        "$schema": "https://turbo.build/schema.json",
        "tasks": {
            "build": {
                "dependsOn": ["^build"],
                "outputs": [".next/**", "!.next/cache/**", "dist/**"]
            },
            "lint": {},
            "dev": {
                "cache": false,
                "persistent": true
            }
        }
    };

    fs.writeFileSync(
        path.join(projectPath, 'turbo.json'),
        JSON.stringify(turboJson, null, 2)
    );

    logger.success('✅ Project structure created');
    logger.info('📦 Installing dependencies...');

    try {
        // Check if pnpm is installed
        try {
            execSync('pnpm --version', { stdio: 'ignore' });
        } catch {
            logger.info('Installing pnpm...');
            execSync('npm install -g pnpm', { stdio: 'ignore' });
        }

        execSync('pnpm install', { cwd: projectPath, stdio: 'inherit' });
        logger.success('✅ Dependencies installed');

        logger.info(pc.green(`\n🎉 Project ${projectName} created successfully!`));
        logger.info(`\nTo get started:\n`);
        logger.info(pc.cyan(`  cd ${projectName}`));
        logger.info(pc.cyan(`  pnpm dev\n`));
    } catch (error) {
        logger.error('Failed to install dependencies');
    }
}

program.parse();
