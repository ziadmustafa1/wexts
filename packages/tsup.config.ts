import { defineConfig } from 'tsup';

const commonOptions = {
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
    target: 'node20',
    shims: true,
};

export default defineConfig([
    {
        ...commonOptions,
        entry: {
            'next/index': 'src/next/index.ts',
        },
        clean: false,
        external: ['react', 'react-dom', 'next', 'wexts'],
        splitting: false, // Disable splitting to keep 'use client' directive
        esbuildOptions(options) {
            options.banner = {
                js: '"use client";',
            };
        },
    },
    {
        ...commonOptions,
        entry: {
            'index': 'src/index.ts',
            'cli/index': 'src/cli/index.ts',
            'client/index': 'src/client/index.ts',
            'nest/index': 'src/nest/index.ts',
            'types/index': 'src/types/index.ts',
            'codegen/index': 'src/codegen/index.ts',
            'dev-server/index': 'src/dev-server/index.ts'
        },
        clean: false,
        external: [
            'vitest',
            '@nestjs/common',
            '@nestjs/core',
            '@nestjs/platform-fastify',
            'react',
            'react-dom',
            'next',
            'fsevents'
        ],
    }
]);
