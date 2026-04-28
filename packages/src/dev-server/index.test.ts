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
        const server = new FusionDevServer();

        await expect(server.start({
            apiPath,
            webPath,
            useProxy: true,
        })).rejects.toThrow('legacy dev proxy is disabled');
    });
});
