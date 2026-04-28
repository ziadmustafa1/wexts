import * as path from 'path';
import * as ts from 'typescript';
import type {
    RpcManifest,
    RpcMethodManifest,
    RpcParameterManifest,
    RpcServiceManifest,
} from '../rpc/types';

export interface RouteInfo {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    handler: string;
    controllerName: string;
}

export interface ControllerInfo {
    name: string;
    prefix: string;
    routes: RouteInfo[];
}

const RPC_SERVICE_DECORATORS = new Set(['RpcService', 'WextsRpcService']);
const RPC_METHOD_DECORATORS = new Set(['RpcMethod', 'WextsRpc']);
const REQUIRE_AUTH_DECORATORS = new Set(['RequireAuth']);

/**
 * Parse NestJS controllers to extract Fusion metadata
 */
export class NestJSParser {
    private program: ts.Program;

    constructor(private projectPath: string) {
        const configPath = ts.findConfigFile(projectPath, ts.sys.fileExists, 'tsconfig.json');
        if (!configPath) {
            throw new Error('tsconfig.json not found');
        }

        const config = ts.readConfigFile(configPath, ts.sys.readFile);
        const parsedConfig = ts.parseJsonConfigFileContent(
            config.config,
            ts.sys,
            path.dirname(configPath)
        );

        this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
    }

    /**
     * Find all controllers with @FusionController decorator
     */
    findFusionControllers(): ControllerInfo[] {
        const controllers: ControllerInfo[] = [];
        const sourceFiles = this.program.getSourceFiles();

        for (const sourceFile of sourceFiles) {
            if (sourceFile.fileName.includes('node_modules')) continue;
            if (!sourceFile.fileName.includes('.controller.ts')) continue;

            const fileControllers = this.parseSourceFile(sourceFile);
            controllers.push(...fileControllers);
        }

        return controllers;
    }

    findRpcManifest(): RpcManifest {
        const services: RpcServiceManifest[] = [];

        for (const sourceFile of this.program.getSourceFiles()) {
            if (sourceFile.fileName.includes('node_modules')) continue;
            if (!sourceFile.fileName.endsWith('.ts')) continue;
            if (sourceFile.fileName.endsWith('.d.ts')) continue;

            services.push(...this.parseRpcServices(sourceFile));
        }

        services.sort((a, b) => a.name.localeCompare(b.name));
        for (const service of services) {
            service.methods.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (services.length === 0) {
            return {
                schemaVersion: 1,
                services,
            };
        }

        return {
            schemaVersion: 1,
            services,
        };
    }

    private parseSourceFile(sourceFile: ts.SourceFile): ControllerInfo[] {
        const controllers: ControllerInfo[] = [];

        ts.forEachChild(sourceFile, (node) => {
            if (ts.isClassDeclaration(node) && node.name) {
                const controllerInfo = this.parseController(node);
                if (controllerInfo) {
                    controllers.push(controllerInfo);
                }
            }
        });

        return controllers;
    }

    private parseController(classNode: ts.ClassDeclaration): ControllerInfo | null {
        const decorators = ts.getDecorators(classNode);
        if (!decorators) return null;

        let controllerPrefix = '';
        let isFusionController = false;

        // Check for @FusionController decorator
        for (const decorator of decorators) {
            const expr = decorator.expression;
            if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
                const decoratorName = expr.expression.text;

                if (decoratorName === 'FusionController') {
                    isFusionController = true;
                    if (expr.arguments.length > 0) {
                        const arg = expr.arguments[0];
                        if (ts.isStringLiteral(arg)) {
                            controllerPrefix = arg.text;
                        }
                    }
                }
            }
        }

        if (!isFusionController) return null;

        const routes = this.parseRoutes(classNode);
        const className = classNode.name?.text || 'Unknown';

        return {
            name: className,
            prefix: controllerPrefix,
            routes: routes.map(r => ({ ...r, controllerName: className })),
        };
    }

    private parseRoutes(classNode: ts.ClassDeclaration): RouteInfo[] {
        const routes: RouteInfo[] = [];

        classNode.members.forEach((member) => {
            if (ts.isMethodDeclaration(member)) {
                const decorators = ts.getDecorators(member);
                if (!decorators) return;

                for (const decorator of decorators) {
                    const expr = decorator.expression;
                    if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
                        const decoratorName = expr.expression.text;

                        let method: RouteInfo['method'] | null = null;
                        let routePath = '';

                        // Map decorator to HTTP method
                        if (decoratorName === 'FusionGet') method = 'GET';
                        else if (decoratorName === 'FusionPost') method = 'POST';
                        else if (decoratorName === 'FusionPut') method = 'PUT';
                        else if (decoratorName === 'FusionDelete') method = 'DELETE';

                        if (method) {
                            // Get route path from decorator argument
                            if (expr.arguments.length > 0) {
                                const arg = expr.arguments[0];
                                if (ts.isStringLiteral(arg)) {
                                    routePath = arg.text;
                                }
                            }

                            const handlerName = (member.name as ts.Identifier).text;

                            routes.push({
                                method,
                                path: routePath,
                                handler: handlerName,
                                controllerName: '', // Will be set by caller
                            });
                        }
                    }
                }
            }
        });

        return routes;
    }

    private parseRpcServices(sourceFile: ts.SourceFile): RpcServiceManifest[] {
        const services: RpcServiceManifest[] = [];
        const rootDir = path.resolve(this.projectPath);

        ts.forEachChild(sourceFile, (node) => {
            if (!ts.isClassDeclaration(node) || !node.name) return;

            const serviceDecorator = this.findDecorator(node, RPC_SERVICE_DECORATORS);
            if (!serviceDecorator) return;

            const className = node.name.text;
            const serviceOptions = this.readDecoratorOptions(serviceDecorator);
            const classRequiresAuth = serviceOptions.requireAuth || this.hasDecorator(node, REQUIRE_AUTH_DECORATORS);
            const serviceName = serviceOptions.name || toStableServiceName(className);
            const methods = this.parseRpcMethods(node, classRequiresAuth, sourceFile);

            if (methods.length === 0) return;

            services.push({
                name: serviceName,
                className,
                importPath: toPosixPath(path.relative(rootDir, sourceFile.fileName).replace(/\.ts$/, '')),
                requireAuth: classRequiresAuth,
                methods,
            });
        });

        return services;
    }

    private parseRpcMethods(classNode: ts.ClassDeclaration, classRequiresAuth: boolean, sourceFile: ts.SourceFile): RpcMethodManifest[] {
        const methods: RpcMethodManifest[] = [];

        for (const member of classNode.members) {
            if (!ts.isMethodDeclaration(member)) continue;
            if (!ts.isIdentifier(member.name)) continue;

            const methodDecorator = this.findDecorator(member, RPC_METHOD_DECORATORS);
            if (!methodDecorator) continue;

            const handlerName = member.name.text;
            const methodOptions = this.readDecoratorOptions(methodDecorator);
            const requireAuth = classRequiresAuth || methodOptions.requireAuth || this.hasDecorator(member, REQUIRE_AUTH_DECORATORS);

            methods.push({
                name: methodOptions.name || handlerName,
                handlerName,
                requireAuth,
                parameters: member.parameters.map((parameter) => this.parseParameter(parameter, sourceFile)),
                returnType: member.type ? getNodeText(member.type, sourceFile) : 'unknown',
            });
        }

        return methods;
    }

    private parseParameter(parameter: ts.ParameterDeclaration, sourceFile: ts.SourceFile): RpcParameterManifest {
        return {
            name: ts.isIdentifier(parameter.name) ? parameter.name.text : parameter.name.getText(),
            type: parameter.type ? getNodeText(parameter.type, sourceFile) : 'unknown',
            optional: Boolean(parameter.questionToken || parameter.initializer),
        };
    }

    private findDecorator(
        node: ts.ClassDeclaration | ts.MethodDeclaration,
        names: Set<string>
    ): ts.Decorator | undefined {
        const decorators = ts.getDecorators(node);
        if (!decorators) return undefined;

        return decorators.find((decorator) => {
            const name = getDecoratorName(decorator);
            return Boolean(name && names.has(name));
        });
    }

    private hasDecorator(
        node: ts.ClassDeclaration | ts.MethodDeclaration,
        names: Set<string>
    ): boolean {
        return Boolean(this.findDecorator(node, names));
    }

    private readDecoratorOptions(decorator: ts.Decorator): { name?: string; requireAuth?: boolean } {
        const expression = decorator.expression;
        if (!ts.isCallExpression(expression)) return {};

        const firstArg = expression.arguments[0];
        if (!firstArg) return {};

        if (ts.isStringLiteral(firstArg)) {
            return { name: firstArg.text };
        }

        if (!ts.isObjectLiteralExpression(firstArg)) return {};

        const result: { name?: string; requireAuth?: boolean } = {};

        for (const property of firstArg.properties) {
            if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) continue;

            if (property.name.text === 'name' && ts.isStringLiteral(property.initializer)) {
                result.name = property.initializer.text;
            }

            if (property.name.text === 'requireAuth') {
                if (property.initializer.kind === ts.SyntaxKind.TrueKeyword) {
                    result.requireAuth = true;
                } else if (property.initializer.kind === ts.SyntaxKind.FalseKeyword) {
                    result.requireAuth = false;
                }
            }
        }

        return result;
    }
}

function getDecoratorName(decorator: ts.Decorator): string | undefined {
    const expression = decorator.expression;
    if (ts.isIdentifier(expression)) return expression.text;
    if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression)) {
        return expression.expression.text;
    }

    return undefined;
}

function toStableServiceName(className: string): string {
    const withoutSuffix = className.replace(/(Service|Controller)$/, '');
    return withoutSuffix.charAt(0).toLowerCase() + withoutSuffix.slice(1);
}

function toPosixPath(filePath: string): string {
    return filePath.split(path.sep).join(path.posix.sep);
}

function getNodeText(node: ts.Node, sourceFile: ts.SourceFile): string {
    return sourceFile.text.slice(node.getStart(sourceFile), node.getEnd());
}
