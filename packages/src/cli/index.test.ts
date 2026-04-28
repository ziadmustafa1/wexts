import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { createCliProgram, runDoctor } from './index';

describe('cli', () => {
    it('reports the package version', () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
        expect(createCliProgram().version()).toBe(pkg.version);
    });

    it('fails clearly for unknown commands', () => {
        const program = createCliProgram();
        program.exitOverride();

        expect(() => program.parse(['node', 'wexts', 'unknown-command'])).toThrow();
    });

    it('doctor catches broken security config', () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-doctor-'));
        fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
            name: 'fixture',
            packageManager: 'pnpm@10.22.0',
        }));
        fs.mkdirSync(path.join(cwd, 'apps/api/src/auth'), { recursive: true });
        fs.writeFileSync(path.join(cwd, 'apps/api/src/auth/auth.module.ts'), `export const secret = 'default-secret';`);

        const result = runDoctor(cwd, true);

        expect(result.errors).toContain('JWT fallback "default-secret" found. Production apps must fail without a strong JWT_SECRET.');
    });

    it('doctor documents separate-process dev mode', () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-doctor-dev-'));
        fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
            name: 'fixture',
            packageManager: 'pnpm@10.22.0',
        }));
        fs.mkdirSync(path.join(cwd, 'apps/api'), { recursive: true });
        fs.mkdirSync(path.join(cwd, 'apps/web'), { recursive: true });

        expect(runDoctor(cwd).warnings).toContain('Development mode starts separate web/API processes. Single-port serving is the production `wexts start` runtime path.');
    });
});
