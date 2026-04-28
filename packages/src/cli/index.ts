#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { createRequire } from 'module';
import * as pc from 'picocolors';
import { logger } from '../core/logger';

interface CommonOptions {
    cwd?: string;
}

export function createCliProgram(): Command {
    const program = new Command();

    program
        .name('wexts')
        .description('Wexts - production-focused single-runtime Next.js + NestJS toolkit')
        .version('3.0.2');

    program
        .command('create <project-name>')
        .description('Create a compatibility project from bundled legacy templates')
        .option('-t, --template <template>', 'Legacy template to use (monorepo|api|web)', 'monorepo')
        .option('--skip-install', 'Skip dependency installation', false)
        .action(async (projectName: string, options: { template: string; skipInstall: boolean }) => {
            await createProject(projectName, options.template, { skipInstall: options.skipInstall });
        });

    program
        .command('dev')
        .description('Start local development processes')
        .option('-a, --api <path>', 'Path to API project', './apps/api')
        .option('-w, --web <path>', 'Path to Web project', './apps/web')
        .option('-p, --port <port>', 'Port for web server', '3000')
        .option('--api-port <port>', 'Port for API server', '5050')
        .option('--proxy', 'Enable development proxy on a separate proxy port', false)
        .action(async (options: { api: string; web: string; port: string; apiPort: string; proxy: boolean }) => {
            const { FusionDevServer } = await import('../dev-server/index.js');
            const server = new FusionDevServer();
            await server.start({
                apiPath: options.api,
                webPath: options.web,
                webPort: Number(options.port),
                apiPort: Number(options.apiPort),
                useProxy: options.proxy,
            });
        });

    program
        .command('generate [type] [name]')
        .alias('g')
        .description('Generate RPC manifest/client, or scaffold a minimal RPC service')
        .option('-p, --project <path>', 'Path to NestJS project', './apps/api')
        .option('-o, --output <path>', 'Output directory for generated RPC client', './apps/web/lib/wexts')
        .action(async (type: string | undefined, name: string | undefined, options: { project: string; output: string }) => {
            if (!type || type === 'rpc') {
                const { generateRpcClient } = await import('../codegen/index.js');
                const manifest = await generateRpcClient({
                    projectPath: path.resolve(options.project),
                    outputPath: path.resolve(options.output),
                });
                logger.success(`Generated Wexts RPC client for ${manifest.services.length} service(s).`);
                return;
            }

            if (type === 'service') {
                if (!name) throw new Error('Service name is required: wexts generate service hello');
                await scaffoldRpcService(path.resolve(options.project), name);
                logger.success(`Created RPC service ${name}. Run wexts generate to update the client.`);
                return;
            }

            throw new Error(`Unknown generator "${type}". Supported generators: rpc, service.`);
        });

    program
        .command('codegen')
        .description('Alias for wexts generate rpc')
        .option('-p, --project <path>', 'Path to NestJS project', './apps/api')
        .option('-o, --output <path>', 'Output directory for generated RPC client', './apps/web/lib/wexts')
        .action(async (options: { project: string; output: string }) => {
            const { generateRpcClient } = await import('../codegen/index.js');
            const manifest = await generateRpcClient({
                projectPath: path.resolve(options.project),
                outputPath: path.resolve(options.output),
            });
            logger.success(`Generated Wexts RPC client for ${manifest.services.length} service(s).`);
        });

    program
        .command('build')
        .description('Build a Wexts project for production')
        .option('--skip-generate', 'Skip RPC generation before build', false)
        .option('-p, --project <path>', 'Path to NestJS project', './apps/api')
        .option('-o, --output <path>', 'Output directory for generated RPC client', './apps/web/lib/wexts')
        .action(async (options: { skipGenerate: boolean; project: string; output: string }) => {
            if (!options.skipGenerate && fs.existsSync(options.project)) {
                const { generateRpcClient } = await import('../codegen/index.js');
                await generateRpcClient({
                    projectPath: path.resolve(options.project),
                    outputPath: path.resolve(options.output),
                });
            }
            runScript('build', { cwd: process.cwd() });
        });

    program
        .command('start')
        .description('Start the production Wexts runtime')
        .option('-c, --config <path>', 'Runtime config module path', './wexts.runtime.js')
        .option('-p, --port <port>', 'Port to listen on', process.env.PORT ?? '3000')
        .action(async (options: { config: string; port: string }) => {
            const { startWextsRuntime } = await import('../runtime/index.js');
            const configPath = path.resolve(options.config);
            const runtimeConfig = fs.existsSync(configPath)
                ? await loadRuntimeConfig(configPath)
                : {};
            await startWextsRuntime({
                ...runtimeConfig,
                port: Number(options.port),
                dev: false,
            });
        });

    program
        .command('vercel-build')
        .description('Build for Vercel using Build Output API v3')
        .option('-p, --project <path>', 'Path to NestJS project', './apps/api')
        .option('-o, --output <path>', 'Output dir for RPC client', './apps/web/lib/wexts')
        .option('-c, --config <path>', 'Runtime config module path', './wexts.runtime.js')
        .option('--skip-codegen', 'Skip RPC generation', false)
        .option('--skip-build', 'Skip project build step', false)
        .option('--node-version <version>', 'Node.js version for Vercel function', '20')
        .option('--max-duration <seconds>', 'Max duration for serverless function', '30')
        .action(async (options: {
            project: string;
            output: string;
            config: string;
            skipCodegen: boolean;
            skipBuild: boolean;
            nodeVersion: string;
            maxDuration: string;
        }) => {
            const { buildVercelOutput } = await import('../vercel-builder/index.js');
            const result = await buildVercelOutput({
                rootDir: process.cwd(),
                apiProjectPath: options.project,
                rpcOutputPath: options.output,
                runtimeConfigPath: options.config,
                skipCodegen: options.skipCodegen,
                skipBuild: options.skipBuild,
                nodeVersion: options.nodeVersion,
                maxDuration: Number(options.maxDuration),
            });
            if (result.warnings.length > 0) {
                for (const warning of result.warnings) logger.warn(warning);
            }
            if (result.errors.length > 0) {
                for (const error of result.errors) logger.error(error);
                process.exit(1);
            }
            logger.success('Vercel build output ready at .vercel/output');
        });

    program
        .command('doctor')
        .description('Validate Wexts project configuration')
        .option('--security', 'Run security-specific checks', false)
        .action(async (options: { security: boolean }) => {
            const result = runDoctor(process.cwd(), options.security);
            for (const warning of result.warnings) logger.warn(warning);
            for (const error of result.errors) logger.error(error);
            if (result.errors.length > 0) process.exit(1);
            logger.success(options.security ? 'Security doctor passed.' : 'Doctor passed.');
        });

    return program;
}

export interface DoctorResult {
    errors: string[];
    warnings: string[];
}

export function runDoctor(cwd: string, security = false): DoctorResult {
    const result: DoctorResult = { errors: [], warnings: [] };
    const pkgPath = path.join(cwd, 'package.json');

    if (!fs.existsSync(pkgPath)) {
        result.errors.push('package.json not found.');
        return result;
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.packageManager?.startsWith('pnpm@')) {
        result.warnings.push('packageManager should pin pnpm.');
    }

    for (const dir of ['apps/api', 'apps/web']) {
        if (!fs.existsSync(path.join(cwd, dir))) {
            result.warnings.push(`${dir} not found; some Wexts commands may need explicit paths.`);
        }
    }

    if (fs.existsSync(path.join(cwd, 'apps/api')) && fs.existsSync(path.join(cwd, 'apps/web'))) {
        result.warnings.push('Development mode starts separate web/API processes. Single-port serving is the production `wexts start` runtime path.');
    }

    if (security) {
        const source = readAllText(cwd, ['apps/api/src', 'packages/templates/nestjs-api/src']);
        if (source.includes('default-secret')) {
            result.errors.push('JWT fallback "default-secret" found. Production apps must fail without a strong JWT_SECRET.');
        }
        if (/origin:\s*['"]\*['"]/.test(source)) {
            result.errors.push('Wildcard CORS origin found. Use an explicit origin allowlist.');
        }
    }

    return result;
}

async function createProject(projectName: string, template: string, options: { skipInstall: boolean }): Promise<void> {
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
        throw new Error(`Directory already exists: ${projectName}`);
    }

    const templatePath = findTemplatePath();
    if (!templatePath) {
        throw new Error('Template directory not found in package.');
    }

    fs.mkdirSync(projectPath, { recursive: true });

    if (template === 'monorepo') {
        fs.mkdirSync(path.join(projectPath, 'apps'), { recursive: true });
        fs.cpSync(path.join(templatePath, 'nestjs-api'), path.join(projectPath, 'apps/api'), { recursive: true });
        fs.cpSync(path.join(templatePath, 'nextjs-web'), path.join(projectPath, 'apps/web'), { recursive: true });
        fs.writeFileSync(path.join(projectPath, 'pnpm-workspace.yaml'), "packages:\n  - 'apps/*'\n");
        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
            name: projectName,
            private: true,
            packageManager: 'pnpm@10.22.0',
            scripts: {
                dev: 'wexts dev',
                generate: 'wexts generate',
                build: 'wexts build',
                start: 'wexts start',
                doctor: 'wexts doctor',
            },
            devDependencies: {
                wexts: 'latest',
            },
        }, null, 2));
    } else if (template === 'api') {
        fs.cpSync(path.join(templatePath, 'nestjs-api'), projectPath, { recursive: true });
    } else if (template === 'web') {
        fs.cpSync(path.join(templatePath, 'nextjs-web'), projectPath, { recursive: true });
    } else {
        throw new Error(`Unknown template "${template}".`);
    }

    if (!options.skipInstall) {
        runCommand(detectPackageManager(projectPath), ['install'], projectPath);
    }
}

async function scaffoldRpcService(apiProjectPath: string, rawName: string): Promise<void> {
    const serviceName = toKebabCase(rawName);
    const className = `${toPascalCase(serviceName)}Service`;
    const dir = path.join(apiProjectPath, 'src', serviceName);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${serviceName}.service.ts`), `import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: '${toCamelCase(serviceName)}', requireAuth: false })
export class ${className} {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return \`Hello, \${name}!\`;
  }
}
`);
}

function runScript(script: string, options: CommonOptions): void {
    const cwd = options.cwd ?? process.cwd();
    const packageManager = detectPackageManager(cwd);
    const args = packageManager === 'npm' ? ['run', script] : ['run', script];
    runCommand(packageManager, args, cwd);
}

function runCommand(command: string, args: string[], cwd: string): void {
    const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    if (result.status !== 0) {
        throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
    }
}

function detectPackageManager(cwd: string): 'pnpm' | 'npm' {
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
    return 'npm';
}

function findTemplatePath(): string | undefined {
    const candidates = [
        path.resolve(__dirname, '../../templates'),
        path.resolve(__dirname, '../templates'),
        path.resolve(process.cwd(), 'packages/templates'),
    ];

    return candidates.find((candidate) => fs.existsSync(candidate));
}

function readAllText(cwd: string, dirs: string[]): string {
    let text = '';
    for (const dir of dirs) {
        const absolute = path.join(cwd, dir);
        if (!fs.existsSync(absolute)) continue;
        for (const file of walk(absolute)) {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
                text += fs.readFileSync(file, 'utf8');
            }
        }
    }
    return text;
}

function walk(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const absolute = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(absolute);
        return [absolute];
    });
}

function toKebabCase(value: string): string {
    return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase();
}

function toPascalCase(value: string): string {
    return toKebabCase(value).split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

function toCamelCase(value: string): string {
    const pascal = toPascalCase(value);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function pathToFileUrl(filePath: string): string {
    return `file://${filePath}`;
}

async function loadRuntimeConfig(configPath: string): Promise<Record<string, unknown>> {
    if (configPath.endsWith('.mjs')) {
        const mod = await import(pathToFileUrl(configPath));
        return (mod.default ?? mod) as Record<string, unknown>;
    }

    const require = createRequire(__filename);
    const mod = require(configPath);
    return (mod.default ?? mod) as Record<string, unknown>;
}

const invokedAsCli = process.argv[1]
    && (path.basename(process.argv[1]) === 'wexts' || path.basename(process.argv[1]) === 'wexts.cjs' || path.resolve(process.argv[1]).includes(`${path.sep}dist${path.sep}cli${path.sep}index`));

if (invokedAsCli && !process.env.VITEST) {
    createCliProgram().parseAsync(process.argv).catch((error) => {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    });
}
