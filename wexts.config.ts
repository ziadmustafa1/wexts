import { WextsConfig } from 'wexts-config';

const config: WextsConfig = {
    framework: 'wexts',
    version: '2.0.0',

    apps: {
        frontend: {
            dir: 'docs/apps/docs-web',
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
        rootDir: 'docs'
    },

    deployment: {
        vercel: {
            regions: ['iad1'],
            env: {
                NODE_ENV: 'production'
            }
        }
    }
};

export default config;
