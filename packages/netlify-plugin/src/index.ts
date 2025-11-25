import { loadWextsConfig, detectWexts } from '@wexts/config';
import * as path from 'path';

interface NetlifyUtils {
    build: {
        failBuild: (message: string) => void;
        failPlugin: (message: string) => void;
    };
    status: {
        show: (options: { title: string; summary: string }) => void;
    };
    cache: {
        save: (path: string) => Promise<boolean>;
        restore: (path: string) => Promise<boolean>;
    };
}

interface NetlifyContext {
    utils: NetlifyUtils;
    constants: {
        PUBLISH_DIR: string;
        FUNCTIONS_DIST: string;
        CACHE_DIR: string;
    };
    inputs: {
        frontendDir?: string;
        backendDir?: string;
        buildCommand?: string;
        publishDir?: string;
    };
}

/**
 * Plugin initialization - runs before build
 */
export async function onPreBuild({ utils, constants, inputs }: NetlifyContext) {
    console.log('🔍 Detecting WEXTS project...');

    const isWexts = await detectWexts(process.cwd());

    if (!isWexts) {
        utils.build.failPlugin('No WEXTS project detected. Make sure you have wexts in your dependencies or a wexts.config.ts file.');
        return;
    }

    const config = await loadWextsConfig(process.cwd());

    if (!config) {
        console.log('⚠️  No wexts.config.ts found, using defaults');
    } else {
        console.log('✅ Found WEXTS configuration:', {
            frontend: config.apps.frontend.framework,
            backend: config.apps.backend.framework,
            monorepo: config.monorepo.tool
        });

        utils.status.show({
            title: 'WEXTS Framework Detected',
            summary: `Building ${config.apps.frontend.framework} frontend with ${config.apps.backend.framework} backend`
        });
    }

    // Restore cache
    const cacheDir = path.join(process.cwd(), 'node_modules/.cache');
    await utils.cache.restore(cacheDir);
}

/**
 * Main build phase
 */
export async function onBuild({ utils, constants, inputs }: NetlifyContext) {
    console.log('🏗️  Building WEXTS project...');

    const config = await loadWextsConfig(process.cwd());
    const frontendDir = inputs.frontendDir || config?.apps.frontend.dir || 'apps/web';
    const backendDir = inputs.backendDir || config?.apps.backend.dir || 'apps/api';

    // Build frontend
    console.log(`📦 Building frontend in ${frontendDir}...`);

    if (config?.apps.frontend.framework === 'nextjs') {
        // Netlify automatically handles Next.js builds
        console.log('✅ Next.js frontend will be built by Netlify automatically');
    }

    // Build backend (if needed for serverless functions)
    console.log(`📦 Building backend in ${backendDir}...`);

    if (config?.apps.backend.framework === 'nestjs') {
        console.log('✅ NestJS backend can be deployed as serverless functions');
    }
}

/**
 * Post-build - save cache
 */
export async function onPostBuild({ utils, constants }: NetlifyContext) {
    console.log('💾 Caching build artifacts...');

    const config = await loadWextsConfig(process.cwd());
    const frontendDir = config?.apps.frontend.dir || 'apps/web';

    // Cache Next.js build
    const nextCache = path.join(process.cwd(), frontendDir, '.next/cache');
    await utils.cache.save(nextCache);

    // Cache node_modules
    const nodeModulesCache = path.join(process.cwd(), 'node_modules/.cache');
    await utils.cache.save(nodeModulesCache);

    console.log('✅ Build complete!');
}

/**
 * On success - show summary
 */
export async function onSuccess({ utils }: NetlifyContext) {
    const config = await loadWextsConfig(process.cwd());

    utils.status.show({
        title: 'WEXTS Deployment Successful',
        summary: `Your ${config?.apps.frontend.framework} app is now live!`
    });
}

/**
 * On error - provide helpful debugging info
 */
export async function onError({ utils }: NetlifyContext) {
    utils.status.show({
        title: 'WEXTS Build Failed',
        summary: 'Check the build logs for more details. Common issues: missing dependencies, incorrect paths in wexts.config.ts'
    });
}
