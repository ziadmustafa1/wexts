import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { createCliProgram, createProject, runDoctor, scaffoldGenerator } from './index';
import { WextsError } from '../errors';

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

    it('scaffolds predictable generator files without overwriting by default', async () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-generator-'));

        const changedFiles = await scaffoldGenerator({
            type: 'rpc',
            name: 'BillingReport',
            targetRoot: cwd,
        });

        const serviceFile = path.join(cwd, 'src/billing-report/billing-report.service.ts');
        expect(changedFiles).toEqual([serviceFile]);
        expect(fs.readFileSync(serviceFile, 'utf8')).toContain('export class BillingReportService');
        expect(fs.readFileSync(serviceFile, 'utf8')).toContain("@RpcService({ name: 'billingReport'");

        await expect(scaffoldGenerator({
            type: 'rpc',
            name: 'BillingReport',
            targetRoot: cwd,
        })).rejects.toMatchObject({
            code: 'WEXTS_CLI_GENERATOR_FILE_EXISTS',
        });
    });

    it('supports service, module, entity, guard, and config generators', async () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-generators-'));

        await scaffoldGenerator({ type: 'service', name: 'invoice', targetRoot: cwd });
        await scaffoldGenerator({ type: 'module', name: 'invoice', targetRoot: cwd });
        await scaffoldGenerator({ type: 'entity', name: 'invoice', targetRoot: cwd });
        await scaffoldGenerator({ type: 'guard', name: 'invoice', targetRoot: cwd });
        await scaffoldGenerator({ type: 'config', targetRoot: cwd });

        expect(fs.existsSync(path.join(cwd, 'src/invoice/invoice.service.ts'))).toBe(true);
        expect(fs.existsSync(path.join(cwd, 'src/invoice/invoice.module.ts'))).toBe(true);
        expect(fs.existsSync(path.join(cwd, 'src/invoice/invoice.entity.ts'))).toBe(true);
        expect(fs.existsSync(path.join(cwd, 'src/invoice/invoice.guard.ts'))).toBe(true);
        expect(fs.readFileSync(path.join(cwd, 'wexts.runtime.js'), 'utf8')).toContain('WextsRuntimeConfig');
    });

    it('uses formal Wexts errors for missing generator names', async () => {
        await expect(scaffoldGenerator({
            type: 'service',
            targetRoot: fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-generator-error-')),
        })).rejects.toBeInstanceOf(WextsError);
    });

    it('creates a clean verified starter that installs, generates, builds, and passes doctor', async () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-create-'));
        const projectName = 'smoke-app';
        const projectPath = path.join(cwd, projectName);
        const previousCwd = process.cwd();

        try {
            process.chdir(cwd);
            await createProject(projectName, 'starter', {
                skipInstall: false,
                wextsDependency: `file:${path.resolve(__dirname, '../..')}`,
            });
        } finally {
            process.chdir(previousCwd);
        }

        expect(fs.existsSync(path.join(projectPath, 'package.json'))).toBe(true);
        expect(fs.existsSync(path.join(projectPath, 'pnpm-workspace.yaml'))).toBe(true);
        expect(fs.existsSync(path.join(projectPath, 'apps/api/src/hello.service.ts'))).toBe(true);
        expect(fs.existsSync(path.join(projectPath, 'apps/web/lib/wexts/client.ts'))).toBe(true);
        expect(fs.existsSync(path.join(projectPath, 'wexts.runtime.js'))).toBe(true);

        const allFiles = walkFiles(projectPath).map((file) => path.relative(projectPath, file));
        expect(allFiles.some((file) => file.endsWith('package-lock.json'))).toBe(false);

        const allText = allFiles
            .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json'))
            .map((file) => fs.readFileSync(path.join(projectPath, file), 'utf8'))
            .join('\n');
        expect(allText).not.toMatch(/Prisma|Todos|bcryptjs|JWT_SECRET|default-secret/);

        runProjectCommand(projectPath, ['run', 'generate']);
        runProjectCommand(projectPath, ['run', 'build']);
        runProjectCommand(projectPath, ['run', 'doctor']);
        runProjectCommand(projectPath, ['run', 'doctor:security']);
    }, 180_000);
});

function runProjectCommand(cwd: string, args: string[]): void {
    const result = spawnSync('pnpm', args, {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32',
    });
    expect(result.status).toBe(0);
}

function walkFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        if (entry.name === 'node_modules' || entry.name === '.next') return [];
        const absolute = path.join(dir, entry.name);
        if (entry.isDirectory()) return walkFiles(absolute);
        return [absolute];
    });
}
