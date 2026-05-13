import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FusionDevServer } from './dev-server';

describe('dev-server', () => {
    it('fails clearly when legacy proxy is requested', async () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-dev-'));
        const apiPath = path.join(cwd, 'apps/api');
        const webPath = path.join(cwd, 'apps/web');
        fs.mkdirSync(apiPath, { recursive: true });
        fs.mkdirSync(webPath, { recursive: true });
        fs.writeFileSync(path.join(cwd, 'wexts.runtime.js'), 'module.exports = {};');
        const server = new FusionDevServer();

        await expect(server.start({
            apiPath,
            webPath,
            rootDir: cwd,
            useProxy: true,
        })).rejects.toThrow('legacy dev proxy is disabled');
    });

    it('starts the web process through the Wexts runtime so /rpc is served on the web port', () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-dev-runtime-'));
        const apiPath = path.join(cwd, 'apps/api');
        const webPath = path.join(cwd, 'apps/web');
        fs.mkdirSync(apiPath, { recursive: true });
        fs.mkdirSync(webPath, { recursive: true });
        fs.writeFileSync(path.join(apiPath, 'tsconfig.json'), JSON.stringify({ compilerOptions: {} }));
        fs.writeFileSync(path.join(cwd, 'wexts.runtime.js'), 'module.exports = {};');

        const server = new FusionDevServer();
        const processes = server.createProcessConfigs({
            apiPath,
            webPath,
            webPort: 3000,
            apiPort: 5050,
            rootDir: cwd,
            runtimeConfigPath: './wexts.runtime.js',
        });

        expect(processes[0]).toMatchObject({
            name: 'API',
            command: 'pnpm',
            args: ['exec', 'tsc', '-w', '-p', path.join(apiPath, 'tsconfig.json')],
            cwd,
        });
        expect(processes[1]).toMatchObject({
            name: 'Web',
            command: 'pnpm',
            args: ['exec', 'wexts', 'start', '-c', path.join(cwd, 'wexts.runtime.js'), '-p', '3000', '--dev'],
            cwd,
        });
    });
});
