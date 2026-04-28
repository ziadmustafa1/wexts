/**
 * Wexts Vercel Build Output API builder.
 *
 * Produces the `.vercel/output` tree (Build Output API v3) that Vercel
 * uses for deployment. This module is invoked by `wexts vercel-build`.
 *
 * Layout produced:
 *   .vercel/output/
 *     config.json           – { version: 3 }
 *     static/               – public / static assets copied here
 *     functions/
 *       index.func/
 *         index.js           – serverless entry point
 *         package.json       – { type: "module" } or cjs
 *         .vc-config.json    – Vercel function config
 *         ...copied runtime files
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

export interface VercelBuildOptions {
    /** Project root (cwd). Defaults to process.cwd(). */
    rootDir?: string;
    /** Path to NestJS/API project for codegen. */
    apiProjectPath?: string;
    /** Output directory for generated RPC client. */
    rpcOutputPath?: string;
    /** Path to wexts.runtime.js config. */
    runtimeConfigPath?: string;
    /** Node.js runtime version for the Vercel function. */
    nodeVersion?: string;
    /** Max duration in seconds for the serverless function. */
    maxDuration?: number;
    /** Memory size in MB for the serverless function. */
    memory?: number;
    /** Regions to deploy to. */
    regions?: string[];
    /** Skip the RPC codegen step. */
    skipCodegen?: boolean;
    /** Skip the Next.js / project build step. */
    skipBuild?: boolean;
}

export interface VercelBuildResult {
    outputDir: string;
    configPath: string;
    functionDir: string;
    staticDir: string;
    errors: string[];
    warnings: string[];
}

/**
 * Build the `.vercel/output` directory from a Wexts project.
 */
export async function buildVercelOutput(
    options: VercelBuildOptions = {},
): Promise<VercelBuildResult> {
    const rootDir = path.resolve(options.rootDir ?? process.cwd());
    const outputDir = path.join(rootDir, '.vercel', 'output');
    const staticDir = path.join(outputDir, 'static');
    const functionDir = path.join(outputDir, 'functions', 'index.func');
    const configPath = path.join(outputDir, 'config.json');
    const errors: string[] = [];
    const warnings: string[] = [];

    // ── 0. Clean previous output ────────────────────────────────────────
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
    }

    // ── 1. Run RPC codegen ──────────────────────────────────────────────
    if (!options.skipCodegen) {
        const apiDir = path.resolve(rootDir, options.apiProjectPath ?? 'apps/api');
        const rpcOut = path.resolve(rootDir, options.rpcOutputPath ?? 'apps/web/lib/wexts');

        if (fs.existsSync(apiDir)) {
            console.log('🔧 Running RPC codegen...');
            const result = spawnSync(
                'npx',
                ['wexts', 'generate', '-p', apiDir, '-o', rpcOut],
                { cwd: rootDir, stdio: 'inherit', shell: process.platform === 'win32' },
            );
            if (result.status !== 0) {
                errors.push('RPC codegen failed.');
                return { outputDir, configPath, functionDir, staticDir, errors, warnings };
            }
        } else {
            warnings.push(`API directory not found at ${apiDir}; skipping codegen.`);
        }
    }

    // ── 2. Build the project ────────────────────────────────────────────
    if (!options.skipBuild) {
        console.log('🏗️  Building project...');
        // Build API (TypeScript)
        const apiDir = path.resolve(rootDir, options.apiProjectPath ?? 'apps/api');
        if (fs.existsSync(path.join(apiDir, 'tsconfig.json'))) {
            const tscResult = spawnSync('npx', ['tsc', '-p', path.join(apiDir, 'tsconfig.json')], {
                cwd: rootDir,
                stdio: 'inherit',
                shell: process.platform === 'win32',
            });
            if (tscResult.status !== 0) {
                errors.push('API TypeScript compilation failed.');
                return { outputDir, configPath, functionDir, staticDir, errors, warnings };
            }
        }

        // Build Next.js
        const webDir = path.resolve(rootDir, 'apps/web');
        if (fs.existsSync(webDir)) {
            const nextResult = spawnSync('npx', ['next', 'build', webDir], {
                cwd: rootDir,
                stdio: 'inherit',
                shell: process.platform === 'win32',
                env: { ...process.env, NODE_ENV: 'production' },
            });
            if (nextResult.status !== 0) {
                errors.push('Next.js build failed.');
                return { outputDir, configPath, functionDir, staticDir, errors, warnings };
            }
        }
    }

    // ── 3. Create output structure ──────────────────────────────────────
    console.log('📦 Creating .vercel/output...');
    fs.mkdirSync(functionDir, { recursive: true });
    fs.mkdirSync(staticDir, { recursive: true });

    // ── 4. Write config.json ────────────────────────────────────────────
    const config = { version: 3 as const };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // ── 5. Write .vc-config.json for the function ───────────────────────
    const vcConfig = {
        runtime: `nodejs${options.nodeVersion ?? '20'}.x`,
        handler: 'index.js',
        launcherType: 'Nodejs',
        maxDuration: options.maxDuration ?? 30,
        ...(options.memory ? { memory: options.memory } : {}),
        ...(options.regions?.length ? { regions: options.regions } : {}),
    };
    fs.writeFileSync(
        path.join(functionDir, '.vc-config.json'),
        JSON.stringify(vcConfig, null, 2),
    );

    // ── 6. Copy runtime files into the function ─────────────────────────
    const runtimeConfigSrc = path.resolve(
        rootDir,
        options.runtimeConfigPath ?? 'wexts.runtime.js',
    );

    // Copy API dist
    const apiDistDir = path.resolve(rootDir, options.apiProjectPath ?? 'apps/api', 'dist');
    if (fs.existsSync(apiDistDir)) {
        const targetApiDist = path.join(functionDir, 'apps', 'api', 'dist');
        fs.mkdirSync(path.dirname(targetApiDist), { recursive: true });
        fs.cpSync(apiDistDir, targetApiDist, { recursive: true });
    } else {
        warnings.push('API dist not found; function may not have service implementations.');
    }

    // Copy RPC manifest
    const manifestCandidates = [
        path.resolve(rootDir, options.rpcOutputPath ?? 'apps/web/lib/wexts', 'wexts.rpc.manifest.json'),
    ];
    for (const manifestPath of manifestCandidates) {
        if (fs.existsSync(manifestPath)) {
            const relPath = path.relative(rootDir, manifestPath);
            const dest = path.join(functionDir, relPath);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(manifestPath, dest);
            break;
        }
    }

    // Copy wexts.runtime.js (adjusted for Vercel paths)
    if (fs.existsSync(runtimeConfigSrc)) {
        fs.copyFileSync(runtimeConfigSrc, path.join(functionDir, 'wexts.runtime.js'));
    } else {
        warnings.push(`Runtime config not found at ${runtimeConfigSrc}.`);
    }

    // ── 7. Write serverless entry point ─────────────────────────────────
    const entryJs = generateServerlessEntry();
    fs.writeFileSync(path.join(functionDir, 'index.js'), entryJs);

    // ── 8. Write package.json for the function (no workspace:* deps) ───
    const funcPkg = generateFunctionPackageJson(rootDir);
    fs.writeFileSync(
        path.join(functionDir, 'package.json'),
        JSON.stringify(funcPkg, null, 2),
    );

    // ── 9. Copy static assets ───────────────────────────────────────────
    const publicDir = path.join(rootDir, 'apps/web/public');
    if (fs.existsSync(publicDir)) {
        fs.cpSync(publicDir, staticDir, { recursive: true });
    }

    // ── 10. Copy Next.js static output if standalone/export exists ──────
    const nextStaticDir = path.join(rootDir, 'apps/web/.next/static');
    if (fs.existsSync(nextStaticDir)) {
        const dest = path.join(staticDir, '_next', 'static');
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(nextStaticDir, dest, { recursive: true });
    }

    // ── 11. Validate the output ─────────────────────────────────────────
    const validation = validateOutput(outputDir);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);

    if (errors.length === 0) {
        console.log('✅ Vercel Build Output created successfully.');
        console.log(`   Output: ${outputDir}`);
    } else {
        console.error('❌ Vercel build completed with errors:');
        for (const err of errors) {
            console.error(`   • ${err}`);
        }
    }

    return { outputDir, configPath, functionDir, staticDir, errors, warnings };
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function generateServerlessEntry(): string {
    return `// Wexts serverless entry for Vercel
// Auto-generated by wexts vercel-build — do not edit.
const path = require('path');

let handlerPromise;

function getHandler() {
    if (!handlerPromise) {
        handlerPromise = (async () => {
            const { createWextsHandler } = require('wexts/runtime');
            const runtimeConfigPath = path.join(__dirname, 'wexts.runtime.js');
            let runtimeConfig = {};
            try {
                runtimeConfig = require(runtimeConfigPath);
                runtimeConfig = runtimeConfig.default || runtimeConfig;
            } catch (_e) {
                // No runtime config — use defaults
            }
            return createWextsHandler({
                ...runtimeConfig,
                dev: false,
            });
        })();
    }
    return handlerPromise;
}

module.exports = async (req, res) => {
    const handler = await getHandler();
    return handler(req, res);
};
`;
}

function generateFunctionPackageJson(rootDir: string): Record<string, unknown> {
    const projectPkgPath = path.join(rootDir, 'package.json');
    let projectPkg: Record<string, unknown> = {};
    if (fs.existsSync(projectPkgPath)) {
        projectPkg = JSON.parse(fs.readFileSync(projectPkgPath, 'utf8'));
    }

    // Collect dependencies but resolve workspace:* to real versions
    const deps: Record<string, string> = {};
    const rawDeps = (projectPkg.dependencies ?? {}) as Record<string, string>;
    for (const [name, version] of Object.entries(rawDeps)) {
        if (version.startsWith('workspace:')) {
            // Resolve from the monorepo
            const resolved = resolveWorkspaceDependencyVersion(rootDir, name);
            if (resolved) {
                deps[name] = resolved;
            }
            // Skip if not resolvable — it'll be caught by validation
        } else {
            deps[name] = version;
        }
    }

    return {
        name: 'wexts-vercel-function',
        version: '0.0.0',
        private: true,
        main: 'index.js',
        dependencies: deps,
    };
}

function resolveWorkspaceDependencyVersion(rootDir: string, name: string): string | undefined {
    // Walk common monorepo locations
    const candidates = [
        path.join(rootDir, 'packages', 'package.json'),                    // packages/ (the main wexts package)
        path.join(rootDir, 'packages', name, 'package.json'),              // packages/<name>
        path.join(rootDir, 'node_modules', name, 'package.json'),          // fallback
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8'));
                if (pkg.name === name && pkg.version) {
                    return `^${pkg.version}`;
                }
            } catch {
                // ignore
            }
        }
    }

    return undefined;
}

export interface ValidationResult {
    errors: string[];
    warnings: string[];
}

export function validateOutput(outputDir: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const configPath = path.join(outputDir, 'config.json');
    if (!fs.existsSync(configPath)) {
        errors.push('Missing .vercel/output/config.json');
    } else {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.version !== 3) {
            errors.push(`config.json version must be 3, got ${config.version}`);
        }
    }

    const funcDir = path.join(outputDir, 'functions', 'index.func');
    if (!fs.existsSync(funcDir)) {
        errors.push('Missing .vercel/output/functions/index.func');
    } else {
        if (!fs.existsSync(path.join(funcDir, 'index.js'))) {
            errors.push('Missing index.js in function directory');
        }
        if (!fs.existsSync(path.join(funcDir, '.vc-config.json'))) {
            errors.push('Missing .vc-config.json in function directory');
        }
        const funcPkgPath = path.join(funcDir, 'package.json');
        if (!fs.existsSync(funcPkgPath)) {
            errors.push('Missing package.json in function directory');
        } else {
            const funcPkgContent = fs.readFileSync(funcPkgPath, 'utf8');
            if (funcPkgContent.includes('workspace:')) {
                errors.push('Function package.json contains workspace:* protocol — not deployable.');
            }
        }
    }

    return { errors, warnings };
}
