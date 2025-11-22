import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/client/index.ts',
        'src/types/index.ts',
        'src/cli/index.ts',
        'src/nest/index.ts',
        'src/next/index.ts',
    ],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    external: [
        'vitest',
        '@nestjs/common',
        '@nestjs/core',
        'react',
        'react-dom',
        'next',
    ],
    banner: {
        js: '#!/usr/bin/env node',
    },
});
