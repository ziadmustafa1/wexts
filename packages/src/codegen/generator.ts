import { ControllerInfo, RouteInfo } from './parser';
import { filesystem } from '../core/filesystem';
import * as path from 'path';

export interface GenerateOptions {
    controllers: ControllerInfo[];
    outputPath: string;
    baseUrl?: string;
}

/**
 * Generate TypeScript API client from controller metadata
 */
export class ClientGenerator {
    async generate(options: GenerateOptions): Promise<void> {
        const { controllers, outputPath } = options;

        // Generate client file
        const clientCode = this.generateClientCode(controllers, options.baseUrl);
        await filesystem.writeFile(path.join(outputPath, 'client.ts'), clientCode);

        // Generate barrel export
        const indexCode = `export * from './client';\n`;
        await filesystem.writeFile(path.join(outputPath, 'index.ts'), indexCode);

        console.log(`✅ Generated API client at ${outputPath}`);
    }

    private generateClientCode(controllers: ControllerInfo[], baseUrl = '/api'): string {
        const imports = `import { FusionFetcher } from 'wexts/client';\n\n`;

        const clientClass = this.generateClientClass(controllers, baseUrl);

        const exports = `\n// Export singleton instance\nexport const apiClient = new ApiClient();\n`;

        return imports + clientClass + exports;
    }

    private generateClientClass(controllers: ControllerInfo[], baseUrl: string): string {
        let code = `export class ApiClient {\n`;
        code += `  private client: FusionFetcher;\n\n`;
        code += `  constructor(baseUrl: string = '${baseUrl}') {\n`;
        code += `    this.client = new FusionFetcher(baseUrl);\n`;
        code += `  }\n\n`;

        // Generate methods for each controller
        for (const controller of controllers) {
            const methods = this.generateControllerMethods(controller);
            code += methods;
        }

        code += `}\n`;
        return code;
    }

    private generateControllerMethods(controller: ControllerInfo): string {
        let code = `  // ${controller.name} endpoints\n`;

        for (const route of controller.routes) {
            const methodName = this.generateMethodName(controller, route);
            const methodCode = this.generateMethod(controller, route, methodName);
            code += methodCode + '\n';
        }

        return code;
    }

    private generateMethodName(controller: ControllerInfo, route: RouteInfo): string {
        // Convert handler name to camelCase
        // e.g., "findAll" -> "getTodos" (if controller is TodosController)
        const controllerBase = controller.name.replace('Controller', '').toLowerCase();

        if (route.handler === 'findAll') {
            return `get${this.capitalize(controllerBase)}`;
        } else if (route.handler === 'findOne') {
            return `get${this.capitalize(controllerBase)}ById`;
        } else if (route.handler === 'create') {
            return `create${this.capitalize(controllerBase.replace(/s$/, ''))}`;
        } else if (route.handler === 'update') {
            return `update${this.capitalize(controllerBase.replace(/s$/, ''))}`;
        } else if (route.handler === 'remove' || route.handler === 'delete') {
            return `delete${this.capitalize(controllerBase.replace(/s$/, ''))}`;
        }

        // Default: use handler name as-is
        return route.handler;
    }

    private generateMethod(controller: ControllerInfo, route: RouteInfo, methodName: string): string {
        const fullPath = `/${controller.prefix}${route.path}`;
        const hasPathParam = fullPath.includes(':');

        let params = '';
        let pathExpr = `'${fullPath}'`;

        if (hasPathParam) {
            // Extract path param name
            const paramMatch = fullPath.match(/:(\w+)/);
            const paramName = paramMatch ? paramMatch[1] : 'id';
            params = `${paramName}: string`;
            pathExpr = `'${fullPath.replace(`:${paramName}`, '${' + paramName + '}')}'`;
        }

        // Add data param for POST/PUT
        if (route.method === 'POST' || route.method === 'PUT') {
            if (params) params += ', ';
            params += 'data: any';
        }

        let methodBody = '';

        if (route.method === 'GET' || route.method === 'DELETE') {
            methodBody = `    return this.client.${route.method.toLowerCase()}<any>(${pathExpr});`;
        } else {
            methodBody = `    return this.client.${route.method.toLowerCase()}<any>(${pathExpr}, data);`;
        }

        return `  async ${methodName}(${params}): Promise<any> {\n${methodBody}\n  }\n`;
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
