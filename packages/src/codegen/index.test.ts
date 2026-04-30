import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generateRpcClient } from './generator';

describe('codegen', () => {
    it('generates a deterministic RPC manifest and typed client', async () => {
        const fixture = createFixture();
        const outputPath = path.join(fixture, 'generated');

        const manifest = await generateRpcClient({
            projectPath: fixture,
            outputPath,
        });

        expect(manifest.services).toHaveLength(1);
        expect(manifest.services[0]).toMatchObject({
            name: 'hello',
            className: 'HelloService',
            requireAuth: false,
        });
        expect(manifest.services[0]?.methods[0]).toMatchObject({
            name: 'sayHello',
            handlerName: 'sayHello',
            returnType: 'Promise<string>',
        });

        const manifestFile = fs.readFileSync(path.join(outputPath, 'wexts.rpc.manifest.json'), 'utf8');
        const clientFile = fs.readFileSync(path.join(outputPath, 'client.ts'), 'utf8');
        expect(manifestFile).toContain('"name": "hello"');
        expect(clientFile).toContain('hello: {');
        expect(clientFile).toContain('sayHello: (name: string) => Promise<string>');
    });

    it('fails clearly when no RPC services are found', async () => {
        const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-empty-'));
        fs.writeFileSync(path.join(fixture, 'tsconfig.json'), JSON.stringify({
            compilerOptions: {
                target: 'ES2023',
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                experimentalDecorators: true,
            },
            include: ['src/**/*.ts'],
        }));
        fs.mkdirSync(path.join(fixture, 'src'), { recursive: true });
        fs.writeFileSync(path.join(fixture, 'src/empty.ts'), 'export class Empty {}');

        await expect(generateRpcClient({
            projectPath: fixture,
            outputPath: path.join(fixture, 'generated'),
        })).rejects.toMatchObject({
            code: 'WEXTS_CODEGEN_NO_SERVICES',
            suggestedFix: expect.stringContaining('wexts generate'),
        });
    });
});

function createFixture(): string {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'wexts-codegen-'));
    fs.mkdirSync(path.join(fixture, 'src'), { recursive: true });
    fs.writeFileSync(path.join(fixture, 'tsconfig.json'), JSON.stringify({
        compilerOptions: {
            target: 'ES2023',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            strict: true,
        },
        include: ['src/**/*.ts'],
    }, null, 2));
    fs.writeFileSync(path.join(fixture, 'src/hello.service.ts'), `import { RpcMethod, RpcService } from 'wexts/nest';

@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return \`Hello, \${name}!\`;
  }
}
`);
    return fixture;
}
