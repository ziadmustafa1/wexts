import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

export class FileSystem {
    /**
     * Read file as string
     */
    async readFile(filePath: string, encoding: BufferEncoding = 'utf-8'): Promise<string> {
        return readFile(filePath, encoding);
    }

    /**
     * Write file
     */
    async writeFile(filePath: string, content: string): Promise<void> {
        // Ensure directory exists
        await this.ensureDir(path.dirname(filePath));
        return writeFile(filePath, content, 'utf-8');
    }

    /**
     * Read JSON file
     */
    async readJSON<T = any>(filePath: string): Promise<T> {
        const content = await this.readFile(filePath);
        return JSON.parse(content);
    }

    /**
     * Write JSON file
     */
    async writeJSON(filePath: string, data: any, pretty: boolean = true): Promise<void> {
        const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        return this.writeFile(filePath, content);
    }

    /**
     * Check if file/directory exists
     */
    async exists(filePath: string): Promise<boolean> {
        try {
            await access(filePath, fs.constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Ensure directory exists (create if not)
     */
    async ensureDir(dirPath: string): Promise<void> {
        if (!(await this.exists(dirPath))) {
            await mkdir(dirPath, { recursive: true });
        }
    }

    /**
     * Copy file
     */
    async copyFile(src: string, dest: string): Promise<void> {
        const content = await this.readFile(src);
        await this.writeFile(dest, content);
    }

    /**
     * Read directory
     */
    readDir(dirPath: string): Promise<string[]> {
        return promisify(fs.readdir)(dirPath);
    }
}

// Export singleton
export const filesystem = new FileSystem();
