export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export interface LoggerOptions {
    level?: LogLevel;
    prefix?: string;
    timestamp?: boolean;
}

export class Logger {
    private level: LogLevel;
    private prefix: string;
    private timestamp: boolean;

    constructor(options: LoggerOptions = {}) {
        this.level = options.level ?? LogLevel.INFO;
        this.prefix = options.prefix ?? '[Fusion]';
        this.timestamp = options.timestamp ?? true;
    }

    private formatMessage(level: string, ...args: any[]): string {
        const timestamp = this.timestamp ? `[${new Date().toISOString()}]` : '';
        return `${timestamp} ${this.prefix} ${level}: ${args.join(' ')}`;
    }

    debug(...args: any[]): void {
        if (this.level <= LogLevel.DEBUG) {
            console.log(this.formatMessage('DEBUG', ...args));
        }
    }

    info(...args: any[]): void {
        if (this.level <= LogLevel.INFO) {
            console.log(this.formatMessage('INFO', ...args));
        }
    }

    warn(...args: any[]): void {
        if (this.level <= LogLevel.WARN) {
            console.warn(this.formatMessage('WARN', ...args));
        }
    }

    error(...args: any[]): void {
        if (this.level <= LogLevel.ERROR) {
            console.error(this.formatMessage('ERROR', ...args));
        }
    }

    success(...args: any[]): void {
        console.log(this.formatMessage('✓', ...args));
    }
}

// Export singleton instance
export const logger = new Logger();

// Export factory
export function createLogger(options: LoggerOptions): Logger {
    return new Logger(options);
}
