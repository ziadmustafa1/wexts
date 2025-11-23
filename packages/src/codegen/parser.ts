import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import { getFusionMetadata } from '../nest/decorators';

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
}
