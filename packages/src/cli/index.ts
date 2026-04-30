#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { createRequire } from 'module';
import { logger } from '../core/logger';
import { formatWextsError, WextsError } from '../errors';

interface CommonOptions {
    cwd?: string;
}

export function createCliProgram(): Command {
    const program = new Command();

    program
        .name('wexts')
        .description('Wexts - production-focused single-runtime Next.js + NestJS toolkit')
        .version(readPackageVersion());

    program
        .command('create <project-name>')
        .description('Create a verified Wexts starter')
        .option('-t, --template <template>', 'Template to use (starter|legacy)', 'starter')
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
        .option('--force', 'Overwrite generated files if they already exist', false)
        .action(async (type: string | undefined, name: string | undefined, options: { project: string; output: string; force: boolean }) => {
            if (!type || (type === 'rpc' && !name)) {
                const { generateRpcClient } = await import('../codegen/index.js');
                const manifest = await generateRpcClient({
                    projectPath: path.resolve(options.project),
                    outputPath: path.resolve(options.output),
                });
                logger.success(`Generated Wexts RPC client for ${manifest.services.length} service(s).`);
                return;
            }

            if (isScaffoldGenerator(type)) {
                const targetRoot = type === 'config' ? process.cwd() : path.resolve(options.project);
                const changedFiles = await scaffoldGenerator({
                    type,
                    name,
                    targetRoot,
                    force: options.force,
                });
                for (const file of changedFiles) logger.info(`created ${path.relative(process.cwd(), file)}`);
                logger.success(`Generated ${type}${name ? ` ${name}` : ''}.`);
                return;
            }

            throw new Error(`Unknown generator "${type}". Supported generators: rpc, service, module, entity, guard, config.`);
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

export async function createProject(
    projectName: string,
    template: string,
    options: { skipInstall: boolean; wextsDependency?: string }
): Promise<void> {
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
        throw new Error(`Directory already exists: ${projectName}`);
    }

    fs.mkdirSync(projectPath, { recursive: true });

    if (template === 'starter') {
        await createVerifiedStarter(projectPath, projectName, options.wextsDependency ?? resolveCreateWextsDependency(projectPath));
    } else if (template === 'legacy') {
        createLegacyProject(projectPath, projectName);
    } else {
        throw new Error(`Unknown template "${template}". Supported templates: starter, legacy.`);
    }

    if (!options.skipInstall) {
        runCommand(detectPackageManager(projectPath), ['install'], projectPath);
    }
}

async function createVerifiedStarter(projectPath: string, projectName: string, wextsDependency: string): Promise<void> {
    const files: Record<string, string> = {
        'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n",
        'package.json': JSON.stringify({
            name: projectName,
            version: '0.1.0',
            private: true,
            packageManager: 'pnpm@10.22.0',
            scripts: {
                dev: 'wexts dev',
                generate: 'wexts generate -p apps/api -o apps/web/lib/wexts',
                build: 'pnpm run generate && tsc -p apps/api/tsconfig.json && next build apps/web',
                start: 'wexts start -c ./wexts.runtime.js',
                'vercel-build': 'wexts vercel-build -p apps/api -o apps/web/lib/wexts -c ./wexts.runtime.js',
                doctor: 'wexts doctor',
                'doctor:security': 'wexts doctor --security',
            },
            dependencies: {
                '@nestjs/common': '^11.1.19',
                '@nestjs/core': '^11.1.19',
                '@nestjs/platform-fastify': '^11.1.19',
                next: '16.2.4',
                react: '^19.2.5',
                'react-dom': '^19.2.5',
                'reflect-metadata': '^0.2.2',
                rxjs: '^7.8.1',
                wexts: wextsDependency,
            },
            devDependencies: {
                '@types/node': '^22.19.1',
                '@types/react': '^19.2.14',
                '@types/react-dom': '^19.2.3',
                typescript: '^5.9.3',
            },
        }, null, 2),
        'apps/api/package.json': JSON.stringify({
            name: `${projectName}-api`,
            private: true,
            scripts: {
                'start:dev': 'tsc -w -p tsconfig.json',
            },
        }, null, 2),
        'apps/api/tsconfig.json': JSON.stringify({
            compilerOptions: {
                target: 'ES2023',
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                outDir: 'dist',
                rootDir: 'src',
            },
            include: ['src/**/*.ts'],
        }, null, 2),
        'apps/api/src/hello.service.ts': `import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return \`Hello, \${name}!\`;
  }
}
`,
        'apps/web/package.json': JSON.stringify({
            name: `${projectName}-web`,
            private: true,
            scripts: {
                dev: 'next dev -p 3000',
            },
        }, null, 2),
        'apps/web/tsconfig.json': JSON.stringify({
            compilerOptions: {
                target: 'ES2022',
                lib: ['dom', 'dom.iterable', 'es2022'],
                allowJs: false,
                skipLibCheck: true,
                strict: true,
                noEmit: true,
                esModuleInterop: true,
                module: 'esnext',
                moduleResolution: 'bundler',
                resolveJsonModule: true,
                isolatedModules: true,
                jsx: 'react-jsx',
                incremental: true,
                plugins: [{ name: 'next' }],
            },
            include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts', '.next/dev/types/**/*.ts'],
            exclude: ['node_modules'],
        }, null, 2),
        'apps/web/next-env.d.ts': `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is generated by Next.js. Do not edit.
`,
        'apps/web/next.config.ts': `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
`,
        'apps/web/app/layout.tsx': `import type { ReactNode } from 'react';
import { WextsProvider } from '../lib/wexts-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WextsProvider>{children}</WextsProvider>
      </body>
    </html>
  );
}
`,
        'apps/web/app/page.tsx': `'use client';

import { useState } from 'react';
import { useWexts } from '../lib/wexts-provider';

export default function Page() {
  const wexts = useWexts();
  const [message, setMessage] = useState('Not called yet');

  return (
    <main>
      <h1>Wexts Hello RPC</h1>
      <button
        type="button"
        onClick={async () => {
          setMessage(await wexts.hello.sayHello('Bob'));
        }}
      >
        Call RPC
      </button>
      <p>{message}</p>
    </main>
  );
}
`,
        'apps/web/lib/wexts-provider.tsx': `'use client';

import { FusionProvider, useWexts as useGeneratedWexts } from 'wexts/next';
import { createWextsClient, type WextsClient } from './wexts/client';

export function WextsProvider({ children }: { children: React.ReactNode }) {
  return (
    <FusionProvider rpcClient={createWextsClient({ baseUrl: '/rpc' })}>
      {children}
    </FusionProvider>
  );
}

export function useWexts(): WextsClient {
  return useGeneratedWexts<WextsClient>();
}
`,
        'wexts.runtime.js': `const { HelloService } = require('./apps/api/dist/hello.service.js');

module.exports = {
  nextDir: './apps/web',
  rpcManifestPath: './apps/web/lib/wexts/wexts.rpc.manifest.json',
  rpcServices: {
    hello: new HelloService(),
  },
  security: {
    allowedOrigins: ['http://localhost:3000'],
  },
};
`,
        'README.md': `# ${projectName}

Verified Wexts starter with a generated Hello RPC client.

\`\`\`bash
pnpm install
pnpm run generate
pnpm run build
pnpm run doctor
pnpm run doctor:security
pnpm start
\`\`\`
`,
        '.cursorrules': `# Wexts Project AI Rules

You are an expert full-stack developer working on a Wexts application.
Wexts is a unified single-runtime toolkit that combines Next.js (frontend) and NestJS (backend) using a highly typed RPC bridge.

## Project Structure
- \`apps/api/\`: The NestJS backend. Contains business logic, database models, and RPC services.
- \`apps/web/\`: The Next.js frontend. Contains UI components, pages, and consumes the RPC client.
- \`apps/web/lib/wexts\`: The auto-generated typed RPC client (DO NOT EDIT MANUALLY).

## Backend Guidelines (NestJS)
1. **RPC Services**: To create an API endpoint, create a NestJS provider decorated with \`@RpcService({ name: 'serviceName' })\` and methods decorated with \`@RpcMethod()\`.
2. **Imports**: Import \`@RpcService\` and \`@RpcMethod\` from \`wexts/nest\`.
3. Do NOT manually create REST controllers unless explicitly needed for webhooks. Use the RPC bridge for all internal frontend-backend communication.
4. **Auth**: If a service requires authentication, set \`@RpcService({ requireAuth: true })\`.

## Frontend Guidelines (Next.js)
1. **RPC Usage**: To call the backend, import the \`api\` client from \`@/lib/wexts\` or your designated Wexts client file (e.g., \`useWexts()\`).
2. **Syntax**: \`const data = await api.serviceName.methodName(args);\`
3. The \`api\` object is fully type-safe. Rely on TypeScript autocomplete rather than guessing endpoints.

## Development Workflow
- When asked to add a new full-stack feature:
  1. Add the database model (Prisma).
  2. Create/update the NestJS RPC service in \`apps/api\`.
  3. Remind the user to run \`wexts generate\` (or \`pnpm generate\`) so the types sync.
  4. Build the UI in Next.js using the new \`api\` methods.
- **Never** hardcode \`fetch('http://localhost:3000/...')\`. ALWAYS use the generated \`api\` SDK.
`,
    };

    for (const [relativePath, content] of Object.entries(files)) {
        const absolutePath = path.join(projectPath, relativePath);
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, content);
    }

    const { generateRpcClient } = await import('../codegen/index.js');
    await generateRpcClient({
        projectPath: path.join(projectPath, 'apps/api'),
        outputPath: path.join(projectPath, 'apps/web/lib/wexts'),
    });
}

function createLegacyProject(projectPath: string, projectName: string): void {
    const templatePath = findTemplatePath();
    if (!templatePath) {
        throw new Error('Template directory not found in package.');
    }

    fs.mkdirSync(path.join(projectPath, 'apps'), { recursive: true });
    fs.cpSync(path.join(templatePath, 'nestjs-api'), path.join(projectPath, 'apps/api'), { recursive: true });
    fs.cpSync(path.join(templatePath, 'nextjs-web'), path.join(projectPath, 'apps/web'), { recursive: true });
    fs.rmSync(path.join(projectPath, 'apps/web/package-lock.json'), { force: true });
    fs.rmSync(path.join(projectPath, 'apps/api/package-lock.json'), { force: true });
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
            wexts: `^${readPackageVersion()}`,
        },
    }, null, 2));
}

function resolveCreateWextsDependency(projectPath: string): string {
    const packageRoot = path.resolve(__dirname, '../..');
    const cwdLocalPackage = path.join(process.cwd(), 'node_modules/wexts');

    try {
        if (fs.existsSync(cwdLocalPackage) && fs.realpathSync(cwdLocalPackage) === fs.realpathSync(packageRoot)) {
            return `file:${path.relative(projectPath, cwdLocalPackage)}`;
        }
    } catch {
        // Fall back to semver for normal npx/npm usage.
    }

    return `^${readPackageVersion()}`;
}

type ScaffoldGeneratorType = 'rpc' | 'service' | 'module' | 'entity' | 'guard' | 'config';

interface ScaffoldGeneratorOptions {
    type: ScaffoldGeneratorType;
    name?: string;
    targetRoot: string;
    force?: boolean;
}

export async function scaffoldGenerator(options: ScaffoldGeneratorOptions): Promise<string[]> {
    if (options.type !== 'config' && !options.name) {
        throw new WextsError({
            code: 'WEXTS_CLI_GENERATOR_NAME_REQUIRED',
            message: `Generator "${options.type}" requires a name.`,
            suggestedFix: `Run \`wexts generate ${options.type} hello\` or use \`wexts generate config\`.`,
            docsSlug: 'cli',
        });
    }

    if (options.type === 'config') {
        return writeGeneratedFiles(options.targetRoot, [{
            relativePath: 'wexts.runtime.js',
            content: `/** @type {import('wexts/runtime').WextsRuntimeConfig} */
module.exports = {
  rootDir: __dirname,
  port: Number(process.env.PORT || 3000),
  rpcManifestPath: 'apps/web/lib/wexts/wexts.rpc.manifest.json',
  security: {
    enabled: true,
    production: process.env.NODE_ENV === 'production',
    allowedOrigins: process.env.WEXTS_ALLOWED_ORIGINS?.split(',').filter(Boolean) || [],
  },
};
`,
        }], Boolean(options.force));
    }

    const rawName = options.name!;
    const name = toKebabCase(rawName);
    const classBase = toPascalCase(name);
    const srcRoot = path.join(options.targetRoot, 'src');

    const filesByType: Record<Exclude<ScaffoldGeneratorType, 'config'>, { relativePath: string; content: string }[]> = {
        rpc: rpcServiceFiles(name, classBase),
        service: [{
            relativePath: path.join('src', name, `${name}.service.ts`),
            content: `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${classBase}Service {
  async execute(): Promise<string> {
    return '${toCamelCase(name)}';
  }
}
`,
        }],
        module: [{
            relativePath: path.join('src', name, `${name}.module.ts`),
            content: `import { Module } from '@nestjs/common';

@Module({})
export class ${classBase}Module {}
`,
        }],
        entity: [{
            relativePath: path.join('src', name, `${name}.entity.ts`),
            content: `export interface ${classBase}Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
`,
        }],
        guard: [{
            relativePath: path.join('src', name, `${name}.guard.ts`),
            content: `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ${classBase}Guard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
`,
        }],
    };

    fs.mkdirSync(srcRoot, { recursive: true });
    return writeGeneratedFiles(options.targetRoot, filesByType[options.type], Boolean(options.force));
}

function isScaffoldGenerator(type: string): type is ScaffoldGeneratorType {
    return ['rpc', 'service', 'module', 'entity', 'guard', 'config'].includes(type);
}

function rpcServiceFiles(serviceName: string, classBase: string): { relativePath: string; content: string }[] {
    return [{
        relativePath: path.join('src', serviceName, `${serviceName}.service.ts`),
        content: `import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: '${toCamelCase(serviceName)}', requireAuth: false })
export class ${classBase}Service {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return \`Hello, \${name}!\`;
  }
}
`,
    }];
}

function writeGeneratedFiles(root: string, files: { relativePath: string; content: string }[], force: boolean): string[] {
    const changedFiles: string[] = [];

    for (const file of files) {
        const absolutePath = path.join(root, file.relativePath);
        if (fs.existsSync(absolutePath) && !force) {
            throw new WextsError({
                code: 'WEXTS_CLI_GENERATOR_FILE_EXISTS',
                message: `Refusing to overwrite existing file: ${absolutePath}`,
                suggestedFix: 'Review the file, then rerun with --force if overwriting is intentional.',
                docsSlug: 'cli',
            });
        }
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, file.content);
        changedFiles.push(absolutePath);
    }

    return changedFiles;
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
    const packageJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as { packageManager?: string };
        if (pkg.packageManager?.startsWith('pnpm@')) return 'pnpm';
    }
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(cwd, 'pnpm-workspace.yaml'))) return 'pnpm';
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

function readPackageVersion(): string {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    if (!fs.existsSync(packageJsonPath)) return '0.0.0';
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version as string;
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
        logger.error(formatWextsError(error));
        process.exit(1);
    });
}
