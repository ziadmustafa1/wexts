export class FusionError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'FusionError';
    }
}

export class ConfigError extends FusionError {
    constructor(message: string) {
        super(message, 'CONFIG_ERROR');
        this.name = 'ConfigError';
    }
}

export class ValidationError extends FusionError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

export class APIError extends FusionError {
    constructor(message: string, public statusCode?: number) {
        super(message, 'API_ERROR');
        this.name = 'APIError';
    }
}
