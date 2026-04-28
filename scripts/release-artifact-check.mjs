#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const securityDir = join(repoRoot, 'packages/security');
const wextsDir = join(repoRoot, 'packages');
const cleanDir = mkdtempSync(join(tmpdir(), 'wexts-artifact-check-'));
const npmCache = mkdtempSync(join(tmpdir(), 'wexts-artifact-npm-cache-'));

const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => {
    return !key.toLowerCase().startsWith('npm_config_');
}));
Object.assign(env, {
    npm_config_cache: npmCache,
});

function run(command, args, options = {}) {
    console.log(`$ ${command} ${args.join(' ')}`);
    return execFileSync(command, args, {
        cwd: options.cwd ?? repoRoot,
        env,
        encoding: 'utf8',
        stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
}

function pack(cwd) {
    const output = run('npm', ['pack', '--json'], { cwd, capture: true });
    const [artifact] = JSON.parse(output);
    if (!artifact?.filename) {
        throw new Error(`npm pack did not return an artifact for ${cwd}`);
    }

    const tarballPath = join(cwd, artifact.filename);
    if (!existsSync(tarballPath)) {
        throw new Error(`Packed tarball missing: ${tarballPath}`);
    }

    return {
        name: artifact.name,
        version: artifact.version,
        filename: artifact.filename,
        path: tarballPath,
        size: artifact.size,
        unpackedSize: artifact.unpackedSize,
        entryCount: artifact.entryCount,
    };
}

function assertNoWorkspaceProtocol(tarballPath) {
    const packageJson = run('tar', ['-xOf', tarballPath, 'package/package.json'], { capture: true });
    if (packageJson.includes('workspace:')) {
        throw new Error(`${tarballPath} contains a workspace:* dependency and is not publishable.`);
    }
}

function verifyExports() {
    const requireFromCleanProject = createRequire(join(cleanDir, 'verify.cjs'));
    const exportsToResolve = [
        'wexts',
        'wexts/client',
        'wexts/next',
        'wexts/nest',
        'wexts/rpc',
        'wexts/runtime',
        '@wexts/security',
    ];

    for (const specifier of exportsToResolve) {
        const resolved = requireFromCleanProject.resolve(specifier);
        console.log(`resolved ${specifier} -> ${resolved}`);
    }
}

let securityArtifact;
let wextsArtifact;

try {
    securityArtifact = pack(securityDir);
    wextsArtifact = pack(wextsDir);

    assertNoWorkspaceProtocol(securityArtifact.path);
    assertNoWorkspaceProtocol(wextsArtifact.path);

    run('npm', ['init', '-y'], { cwd: cleanDir });
    run('npm', ['install', securityArtifact.path, wextsArtifact.path], { cwd: cleanDir });
    run('npx', ['wexts', '--version'], { cwd: cleanDir });
    run('npx', ['wexts', '--help'], { cwd: cleanDir });
    run('npx', ['wexts', 'doctor'], { cwd: cleanDir });
    verifyExports();

    console.log(JSON.stringify({
        ok: true,
        cleanDir,
        tarballs: [securityArtifact, wextsArtifact],
    }, null, 2));
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    if (process.exitCode !== 1) {
        rmSync(cleanDir, { recursive: true, force: true });
        rmSync(npmCache, { recursive: true, force: true });
    } else {
        console.error(`Preserved failing clean project: ${cleanDir}`);
        console.error(`Preserved npm cache: ${npmCache}`);
    }
}
