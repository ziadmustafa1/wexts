import { defineConfig, type Options } from 'tsup';

const nodeOptions: Options = {
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
    target: 'node20',
    platform: 'node',
    shims: true,
};

const browserOptions: Options = {
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
    target: 'es2022',
    platform: 'browser',
    shims: false,
};

const sharedOptions: Options = {
    ...browserOptions,
    platform: 'neutral',
};

export default defineConfig([
    {
        ...browserOptions,
        entry: {
            'next/index': 'src/next/index.ts',
        },
        clean: false,
        external: ['react', 'react-dom', 'next', 'wexts'],
        esbuildOptions(options) {
            options.banner = {
                js: '"use client";',
            };
        },
    },
    {
        ...browserOptions,
        entry: {
            'client/index': 'src/client/index.ts',
        },
        clean: false,
    },
    {
        ...sharedOptions,
        entry: {
            'rpc/index': 'src/rpc/index.ts',
            'types/index': 'src/types/index.ts',
        },
        clean: false,
    },
    {
        ...nodeOptions,
        entry: {
            'index': 'src/index.ts',
            'cli/index': 'src/cli/index.ts',
            'nest/index': 'src/nest/index.ts',
            'server/index': 'src/server/index.ts',
            'runtime/index': 'src/runtime/index.ts',
            'codegen/index': 'src/codegen/index.ts',
            'dev-server/index': 'src/dev-server/index.ts',
            'vercel-builder/index': 'src/vercel-builder/index.ts'
        },
        clean: false,
        external: [
            'vitest',
            '@nestjs/common',
            '@nestjs/core',
            '@nestjs/platform-fastify',
            '@wexts/security',
            'react',
            'react-dom',
            'next',
            'fastify',
            'fsevents'
        ],
    }
]);
