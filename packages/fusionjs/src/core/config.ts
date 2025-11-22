import * as fs from 'fs';
import * as path from 'path';

export interface FusionConfig {
    [key: string]: any;
}

export class ConfigLoader {
    private config: Map<string, any> = new Map();
    private configDir: string;

    constructor(configDir: string = process.cwd()) {
        this.configDir = configDir;
    }

    /**
     * Load configuration from file or environment
     */
    load(key: string, defaultValue?: any): any {
        if (this.config.has(key)) {
            return this.config.get(key);
        }

        // Try to load from environment variable
        const envKey = `FUSION_${key.toUpperCase()}`;
        if (process.env[envKey]) {
            const value = this.parseEnvValue(process.env[envKey]!);
            this.config.set(key, value);
            return value;
        }

        // Try to load from config file
        const configPath = path.join(this.configDir, 'fusion.config.json');
        if (fs.existsSync(configPath)) {
            try {
                const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                if (fileConfig[key] !== undefined) {
                    this.config.set(key, fileConfig[key]);
                    return fileConfig[key];
                }
            } catch (error) {
                // Silently fail and use default
            }
        }

        return defaultValue;
    }

    /**
     * Set configuration value
     */
    set(key: string, value: any): void {
        this.config.set(key, value);
    }

    /**
     * Get all configuration
     */
    getAll(): FusionConfig {
        return Object.fromEntries(this.config);
    }

    /**
     * Parse environment value (handles JSON strings)
     */
    private parseEnvValue(value: string): any {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
}

// Export singleton instance
export const config = new ConfigLoader();

// Helper function for backward compatibility
export function load(key: string, defaultValue?: any): any {
    return config.load(key, defaultValue);
}
