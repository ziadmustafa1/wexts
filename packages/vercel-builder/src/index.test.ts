import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildVercelOutput, validateOutput } from './index';

describe('vercel-builder', () => {
    let tmpDir: string;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-vercel-test-'));
        // Create a minimal project structure
        fs.mkdirSync(path.join(tmpDir, 'apps/api/dist'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, 'apps/web/lib/wexts'), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, 'apps/web/public'), { recursive: true });

        // Write project package.json without workspace:* deps
        fs.writeFileSync(
            path.join(tmpDir, 'package.json'),
            JSON.stringify({
                name: 'test-project',
                version: '0.1.0',
                private: true,
                dependencies: {
                    'next': '^16.2.4',
                    'react': '^19.2.5',
                },
            }, null, 2),
        );

        // Write a runtime config
        fs.writeFileSync(
            path.join(tmpDir, 'wexts.runtime.js'),
            'module.exports = { nextDir: "./apps/web" };',
        );

        // Write a dummy API dist file
        fs.writeFileSync(
            path.join(tmpDir, 'apps/api/dist/hello.service.js'),
            'module.exports = { HelloService: class { sayHello() { return "hi"; } } };',
        );

        // Write a dummy manifest
        fs.writeFileSync(
            path.join(tmpDir, 'apps/web/lib/wexts/wexts.rpc.manifest.json'),
            JSON.stringify({
                schemaVersion: 1,
                services: [{
                    name: 'hello',
                    className: 'HelloService',
                    importPath: 'src/hello.service',
                    requireAuth: false,
                    methods: [{
                        name: 'sayHello',
                        handlerName: 'sayHello',
                        requireAuth: false,
                        parameters: [],
                        returnType: 'string',
                    }],
                }],
            }),
        );
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('creates .vercel/output/config.json with version 3', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        expect(fs.existsSync(result.configPath)).toBe(true);
        const config = JSON.parse(fs.readFileSync(result.configPath, 'utf8'));
        expect(config.version).toBe(3);
    });

    it('creates functions/index.func directory', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        expect(fs.existsSync(result.functionDir)).toBe(true);
        expect(fs.statSync(result.functionDir).isDirectory()).toBe(true);
    });

    it('generates index.js entry in function directory', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        const entryPath = path.join(result.functionDir, 'index.js');
        expect(fs.existsSync(entryPath)).toBe(true);
        const content = fs.readFileSync(entryPath, 'utf8');
        expect(content).toContain('createWextsHandler');
    });

    it('generates .vc-config.json in function directory', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        const vcConfigPath = path.join(result.functionDir, '.vc-config.json');
        expect(fs.existsSync(vcConfigPath)).toBe(true);
        const vcConfig = JSON.parse(fs.readFileSync(vcConfigPath, 'utf8'));
        expect(vcConfig.runtime).toContain('nodejs');
        expect(vcConfig.handler).toBe('index.js');
    });

    it('generates package.json without workspace:* dependencies', async () => {
        // Add a workspace dep to the project
        const pkgPath = path.join(tmpDir, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        pkg.dependencies['wexts'] = 'workspace:*';
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        const funcPkgPath = path.join(result.functionDir, 'package.json');
        expect(fs.existsSync(funcPkgPath)).toBe(true);
        const funcPkg = fs.readFileSync(funcPkgPath, 'utf8');
        expect(funcPkg).not.toContain('workspace:');
    });

    it('copies API dist files into function', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        const copiedFile = path.join(result.functionDir, 'apps/api/dist/hello.service.js');
        expect(fs.existsSync(copiedFile)).toBe(true);
    });

    it('copies RPC manifest into function', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        const manifestInFunc = path.join(result.functionDir, 'apps/web/lib/wexts/wexts.rpc.manifest.json');
        expect(fs.existsSync(manifestInFunc)).toBe(true);
    });

    it('copies wexts.runtime.js into function', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        expect(fs.existsSync(path.join(result.functionDir, 'wexts.runtime.js'))).toBe(true);
    });

    it('copies static assets', async () => {
        // Create a static asset
        fs.writeFileSync(path.join(tmpDir, 'apps/web/public/favicon.ico'), 'icon');

        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        expect(fs.existsSync(path.join(result.staticDir, 'favicon.ico'))).toBe(true);
    });

    it('validates output passes for correct structure', async () => {
        const result = await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        expect(result.errors).toHaveLength(0);
    });

    it('validateOutput catches missing config.json', () => {
        const fakeDir = path.join(tmpDir, 'fake-output');
        fs.mkdirSync(fakeDir, { recursive: true });

        const result = validateOutput(fakeDir);
        expect(result.errors).toContain('Missing .vercel/output/config.json');
    });

    it('validateOutput catches missing function directory', () => {
        const fakeDir = path.join(tmpDir, 'fake-output');
        fs.mkdirSync(fakeDir, { recursive: true });
        fs.writeFileSync(path.join(fakeDir, 'config.json'), JSON.stringify({ version: 3 }));

        const result = validateOutput(fakeDir);
        expect(result.errors).toContain('Missing .vercel/output/functions/index.func');
    });

    it('cleans previous output before rebuilding', async () => {
        // Build once
        await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        // Add a stale file
        fs.writeFileSync(
            path.join(tmpDir, '.vercel/output/stale-file.txt'),
            'should be removed',
        );

        // Build again
        await buildVercelOutput({
            rootDir: tmpDir,
            skipCodegen: true,
            skipBuild: true,
        });

        expect(fs.existsSync(path.join(tmpDir, '.vercel/output/stale-file.txt'))).toBe(false);
    });
});
