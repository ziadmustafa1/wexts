import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { logger } from '../core/logger';

export interface ScaffoldOptions {
    projectName: string;
    template: 'monorepo' | 'api' | 'web';
    packageManager?: 'npm' | 'pnpm' | 'yarn';
}

export class ProjectScaffolder {
    async scaffold(options: ScaffoldOptions): Promise<void> {
        const { projectName, template } = options;
        const projectPath = join(process.cwd(), projectName);

        logger.info(`Creating project at: ${projectPath}`);

        // Create base directory
        await mkdir(projectPath, { recursive: true });

        if (template === 'monorepo') {
            await this.createMonorepo(projectPath, projectName);
        } else if (template === 'api') {
            await this.createNestJSApp(projectPath, projectName);
        } else if (template === 'web') {
            await this.createNextJSApp(projectPath, projectName);
        }

        logger.success(`Project ${projectName} created successfully!`);
        logger.info(`\nNext steps:`);
        logger.info(`  cd ${projectName}`);
        logger.info(`  fusion dev`);
    }

    private async createMonorepo(projectPath: string, projectName: string): Promise<void> {
        // Create directory structure
        await mkdir(join(projectPath, 'apps', 'api'), { recursive: true });
        await mkdir(join(projectPath, 'apps', 'web'), { recursive: true });
        await mkdir(join(projectPath, 'packages', 'types'), { recursive: true });
        await mkdir(join(projectPath, 'packages', 'api-client'), { recursive: true });

        // Create root package.json
        const packageJson = {
            name: projectName,
            version: '0.0.1',
            private: true,
            workspaces: ['apps/*', 'packages/*'],
            scripts: {
                dev: 'fusion dev',
                build: 'fusion build',
            },
            devDependencies: {
                'wexts': '^1.0.0',
            },
        };

        await writeFile(
            join(projectPath, 'package.json'),
            JSON.stringify(packageJson, null, 2)
        );

        // Create README
        const readme = `# ${projectName}\n\nCreated with wexts\n\n## Getting Started\n\n\`\`\`bash\nfusion dev\n\`\`\`\n`;
        await writeFile(join(projectPath, 'README.md'), readme);
    }

    private async createNestJSApp(projectPath: string, projectName: string): Promise<void> {
        // TODO: Implement NestJS scaffolding
        logger.info('Creating NestJS application...');
    }

    private async createNextJSApp(projectPath: string, projectName: string): Promise<void> {
        // TODO: Implement Next.js scaffolding
        logger.info('Creating Next.js application...');
    }
}
