import { describe, expect, it } from 'vitest';
import { builtinModules } from 'module';
import * as fs from 'fs';
import * as path from 'path';

const FORBIDDEN_RUNTIME_PATTERNS = [
    /\bfileURLToPath\b/,
    /\bprocess\.cwd\s*\(/,
    /\bimport\.meta\.url\b/,
];

const NODE_BUILTINS = new Set([
    ...builtinModules,
    ...builtinModules.map((moduleName) => `node:${moduleName}`),
]);

const RUNTIME_IMPORT_RE = /(?:import\s+(?!type\b)[\s\S]*?\s+from\s+|export\s+(?:\*|\{[\s\S]*?\})\s+from\s+|import\s*\()(['"])([^'"]+)\1/g;

function collectRuntimeGraph(entryFile: string): string[] {
    const seen = new Set<string>();
    const stack = [entryFile];

    while (stack.length > 0) {
        const file = stack.pop()!;
        if (seen.has(file)) continue;
        seen.add(file);

        const source = fs.readFileSync(file, 'utf8');
        for (const match of source.matchAll(RUNTIME_IMPORT_RE)) {
            const specifier = match[2];
            if (NODE_BUILTINS.has(specifier)) {
                throw new Error(`${path.relative(process.cwd(), file)} imports Node-only module ${specifier}`);
            }
            if (!specifier.startsWith('.')) continue;

            stack.push(resolveSourceImport(file, specifier));
        }
    }

    return [...seen].sort();
}

function resolveSourceImport(fromFile: string, specifier: string): string {
    const absolute = path.resolve(path.dirname(fromFile), specifier);
    const candidates = [
        absolute,
        `${absolute}.ts`,
        `${absolute}.tsx`,
        path.join(absolute, 'index.ts'),
        path.join(absolute, 'index.tsx'),
    ];
    const resolved = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!resolved) throw new Error(`Unable to resolve ${specifier} from ${fromFile}`);
    return resolved;
}

describe('wexts/client browser entry', () => {
    it('does not include Node-only runtime APIs in its source import graph', () => {
        const entry = path.resolve(__dirname, 'index.ts');
        const files = collectRuntimeGraph(entry);

        for (const file of files) {
            const source = fs.readFileSync(file, 'utf8');
            for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
                expect(source, `${path.relative(process.cwd(), file)} contains ${pattern}`).not.toMatch(pattern);
            }
        }
    });
});
