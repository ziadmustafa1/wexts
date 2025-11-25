import { BuildOptions, FileFsRef } from '@vercel/build-utils';
import { detectWexts, loadWextsConfig } from '@wexts/config';
import * as path from 'path';

export const version = 3;

/**
 * Detect if this is a WEXTS project
 */
export async function detect(files: { [path: string]: FileFsRef }): Promise<boolean> {
    const filesList = Object.keys(files);

    // Check for wexts.config.ts/js
    const hasConfig = filesList.some(f =>
        f === 'wexts.config.ts' ||
        f === 'wexts.config.js' ||
        f === 'wexts.config.mjs'
    );

    if (hasConfig) {
        return true;
    }

    // Check package.json for wexts dependency
    const hasPkg = filesList.includes('package.json');
    if (hasPkg) {
        try {
            const pkgFile = files['package.json'];
            const pkgContent = await pkgFile.fsPath;
            const pkg = JSON.parse(await require('fs').promises.readFile(pkgContent, 'utf-8'));

            return !!(
                pkg.dependencies?.wexts ||
                pkg.devDependencies?.wexts ||
                pkg.vercel?.framework === 'wexts'
            );
        } catch (error) {
            console.error('Error reading package.json:', error);
        }
    }

    return false;
}

/**
 * Analyze the WEXTS project structure
 */
export async function analyze(options: BuildOptions) {
    const { workPath } = options;

    console.log('🔍 Analyzing WEXTS project...');

    // Load WEXTS config
    const config = await loadWextsConfig(workPath);

    if (!config) {
        console.log('⚠️  No wexts.config found, using defaults');
    } else {
        console.log('✅ Found WEXTS config:', {
            frontend: config.apps.frontend.framework,
            backend: config.apps.backend.framework,
            monorepo: config.monorepo.tool
        });
    }

    return {
        config,
        framework: 'wexts',
        runtime: 'nodejs20.x'
    };
}

/**
 * Build the WEXTS project
 */
export async function build(options: BuildOptions) {
    const { workPath, config } = options;

    console.log('🏗️  Building WEXTS project...');

    const wextsConfig = await loadWextsConfig(workPath);
    const frontendDir = wextsConfig?.apps.frontend.dir || 'apps/web';
    const frontendPath = path.join(workPath, frontendDir);

    // For Next.js projects, delegate to Next.js builder
    if (wextsConfig?.apps.frontend.framework === 'nextjs') {
        console.log('📦 Detected Next.js frontend, using Next.js builder');

        // Import Next.js builder dynamically
        // @ts-ignore
        const { build: nextBuild } = await import('@vercel/next');

        // Build with Next.js builder
        const result = await nextBuild({
            ...options,
            workPath: frontendPath,
            entrypoint: path.join(frontendDir, 'package.json')
        });

        console.log('✅ Build complete');
        return result;
    }

    throw new Error(`Unsupported frontend framework: ${wextsConfig?.apps.frontend.framework}`);
}

/**
 * Prepare cache for future builds
 */
export async function prepareCache(options: BuildOptions) {
    console.log('💾 Preparing cache...');

    const { workPath } = options;
    const wextsConfig = await loadWextsConfig(workPath);
    const frontendDir = wextsConfig?.apps.frontend.dir || 'apps/web';

    return {
        [path.join(frontendDir, '.next/cache')]: new FileFsRef({
            fsPath: path.join(workPath, frontendDir, '.next/cache')
        }),
        'node_modules/.cache': new FileFsRef({
            fsPath: path.join(workPath, 'node_modules/.cache')
        })
    };
}

// Export builder
export default { version, detect, analyze, build, prepareCache };
