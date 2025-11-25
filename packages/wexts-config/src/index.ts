export interface WextsConfig {
    /** Framework identifier */
    readonly framework: 'wexts';

    /** Framework version */
    readonly version: string;

    /** Application configuration */
    apps: {
        /** Frontend application settings */
        frontend: {
            /** Directory path relative to monorepo root */
            dir: string;
            /** Frontend framework type */
            framework: 'nextjs' | 'react' | 'vue' | 'svelte';
            /** Custom build command (optional) */
            buildCommand?: string;
            /** Custom dev command (optional) */
            devCommand?: string;
            /** Output directory after build */
            outputDir?: string;
            /** Port for development server */
            port?: number;
        };

        /** Backend application settings */
        backend: {
            /** Directory path relative to monorepo root */
            dir: string;
            /** Backend framework type */
            framework: 'nestjs' | 'express' | 'fastify';
            /** Custom build command (optional) */
            buildCommand?: string;
            /** Custom dev command (optional) */
            devCommand?: string;
            /** Output directory after build */
            outputDir?: string;
            /** Port for development server */
            port?: number;
        };
    };

    /** Monorepo configuration */
    monorepo: {
        /** Monorepo tool being used */
        tool: 'turborepo' | 'nx' | 'pnpm-workspace' | 'yarn-workspace';
        /** Root directory of the monorepo */
        rootDir?: string;
    };

    /** Deployment configuration (optional) */
    deployment?: {
        /** Platform-specific settings */
        vercel?: {
            /** Regions to deploy to */
            regions?: string[];
            /** Environment variables */
            env?: Record<string, string>;
        };
        netlify?: {
            /** Functions directory */
            functionsDir?: string;
        };
    };
}

/** Default WEXTS configuration */
export const defaultConfig: Partial<WextsConfig> = {
    framework: 'wexts',
    apps: {
        frontend: {
            dir: 'apps/web',
            framework: 'nextjs',
            buildCommand: 'next build',
            devCommand: 'next dev',
            outputDir: '.next',
            port: 3000
        },
        backend: {
            dir: 'apps/api',
            framework: 'nestjs',
            buildCommand: 'nest build',
            devCommand: 'nest start --watch',
            outputDir: 'dist',
            port: 3001
        }
    },
    monorepo: {
        tool: 'turborepo',
        rootDir: '.'
    }
};

/** Helper to load and validate WEXTS config */
export async function loadWextsConfig(rootDir: string): Promise<WextsConfig | null> {
    try {
        const configPath = require.resolve(rootDir + '/wexts.config');
        const config = await import(configPath);
        return config.default || config;
    } catch {
        return null;
    }
}

/** Helper to detect if project uses WEXTS */
export async function detectWexts(rootDir: string): Promise<boolean> {
    try {
        const pkgPath = rootDir + '/package.json';
        const pkg = await import(pkgPath);
        return !!(
            pkg.dependencies?.wexts ||
            pkg.devDependencies?.wexts ||
            pkg.vercel?.framework === 'wexts'
        );
    } catch {
        return false;
    }
}
