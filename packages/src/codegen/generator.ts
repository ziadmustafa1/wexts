import { filesystem } from '../core/filesystem';
import * as path from 'path';
import type { RpcManifest, RpcMethodManifest, RpcServiceManifest } from '../rpc/types';
import { NestJSParser } from './parser';
import { WextsCodegenError } from '../errors';

export interface GenerateOptions {
    outputPath: string;
    manifest: RpcManifest;
    manifestFileName?: string;
    clientFileName?: string;
}

export interface GenerateRpcOptions {
    projectPath: string;
    outputPath: string;
    manifestFileName?: string;
    clientFileName?: string;
}

/**
 * Generate TypeScript API client from controller metadata
 */
export class ClientGenerator {
    async generate(options: GenerateOptions): Promise<void> {
        const {
            manifest,
            outputPath,
            manifestFileName = 'wexts.rpc.manifest.json',
            clientFileName = 'client.ts',
        } = options;

        if (manifest.services.length === 0) {
            throw new WextsCodegenError({
                code: 'WEXTS_CODEGEN_NO_SERVICES',
                message: 'No Wexts RPC services found. Add @RpcService() to a Nest provider and @RpcMethod() to at least one method.',
                suggestedFix: 'Add a decorated RPC service, then run `wexts generate -p apps/api -o apps/web/lib/wexts`.',
                docsSlug: 'codegen',
            });
        }

        const sortedManifest = sortManifest(manifest);
        const clientCode = this.generateRpcClientCode(sortedManifest);
        await filesystem.writeJSON(path.join(outputPath, manifestFileName), sortedManifest, true);
        await filesystem.writeFile(path.join(outputPath, clientFileName), clientCode);

        const indexCode = `export * from './client';\n`;
        await filesystem.writeFile(path.join(outputPath, 'index.ts'), indexCode);
    }

    private generateRpcClientCode(manifest: RpcManifest): string {
        const manifestJson = JSON.stringify(manifest, null, 2);

        return `import { createWextsRpcClient, type WextsRpcClientOptions } from 'wexts/client';
import type { RpcManifest } from 'wexts/rpc';

const manifest = ${manifestJson} satisfies RpcManifest;

${this.generateClientInterface(manifest)}

export function createWextsClient(options?: WextsRpcClientOptions): WextsClient {
  return createWextsRpcClient(manifest, options) as unknown as WextsClient;
}

export const wexts = createWextsClient();
`;
    }

    private generateClientInterface(manifest: RpcManifest): string {
        const services = manifest.services.map((service) => this.generateServiceInterface(service)).join('\n');
        return `export interface WextsClient {\n${services}}\n`;
    }

    private generateServiceInterface(service: RpcServiceManifest): string {
        const methods = service.methods.map((method) => `    ${method.name}: (${this.parametersToSignature(method)}) => Promise<${normalizeReturnType(method.returnType)}>;`).join('\n');
        return `  ${service.name}: {\n${methods}\n  };\n`;
    }

    private parametersToSignature(method: RpcMethodManifest): string {
        return method.parameters
            .map((parameter) => `${parameter.name}${parameter.optional ? '?' : ''}: ${parameter.type}`)
            .join(', ');
    }
}

export async function generateRpcClient(options: GenerateRpcOptions): Promise<RpcManifest> {
    const parser = new NestJSParser(options.projectPath);
    const manifest = parser.findRpcManifest();
    const generator = new ClientGenerator();
    await generator.generate({
        manifest,
        outputPath: options.outputPath,
        manifestFileName: options.manifestFileName,
        clientFileName: options.clientFileName,
    });

    return sortManifest(manifest);
}

function sortManifest(manifest: RpcManifest): RpcManifest {
    return {
        schemaVersion: 1,
        services: [...manifest.services]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((service) => ({
                ...service,
                methods: [...service.methods].sort((a, b) => a.name.localeCompare(b.name)),
            })),
    };
}

function normalizeReturnType(returnType: string): string {
    const match = returnType.match(/^Promise<(.+)>$/);
    return match?.[1] ?? returnType;
}
