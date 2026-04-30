export interface WextsErrorOptions {
    code: string;
    message: string;
    cause?: unknown;
    suggestedFix?: string;
    docsSlug?: string;
}

export class WextsError extends Error {
    readonly code: string;
    readonly suggestedFix?: string;
    readonly docsSlug?: string;

    constructor(options: WextsErrorOptions) {
        super(options.message, options.cause === undefined ? undefined : { cause: options.cause });
        this.name = 'WextsError';
        this.code = options.code;
        this.suggestedFix = options.suggestedFix;
        this.docsSlug = options.docsSlug;
    }

    get docsUrl(): string | undefined {
        return this.docsSlug ? `https://github.com/ziadmustafa1/wexts/blob/main/docs/${this.docsSlug}.md` : undefined;
    }
}

export class WextsRpcError extends WextsError {
    constructor(options: Omit<WextsErrorOptions, 'code'> & { code?: string }) {
        super({ code: options.code ?? 'WEXTS_RPC_ERROR', ...options });
        this.name = 'WextsRpcError';
    }
}

export class WextsCodegenError extends WextsError {
    constructor(options: Omit<WextsErrorOptions, 'code'> & { code?: string }) {
        super({ code: options.code ?? 'WEXTS_CODEGEN_ERROR', ...options });
        this.name = 'WextsCodegenError';
    }
}

export class WextsRuntimeError extends WextsError {
    constructor(options: Omit<WextsErrorOptions, 'code'> & { code?: string }) {
        super({ code: options.code ?? 'WEXTS_RUNTIME_ERROR', ...options });
        this.name = 'WextsRuntimeError';
    }
}

export class WextsSecurityError extends WextsError {
    constructor(options: Omit<WextsErrorOptions, 'code'> & { code?: string }) {
        super({ code: options.code ?? 'WEXTS_SECURITY_ERROR', ...options });
        this.name = 'WextsSecurityError';
    }
}

export function formatWextsError(error: unknown): string {
    if (!(error instanceof WextsError)) {
        return error instanceof Error ? error.message : String(error);
    }

    const lines = [`${error.code}: ${error.message}`];
    if (error.suggestedFix) lines.push(`Suggested fix: ${error.suggestedFix}`);
    if (error.docsUrl) lines.push(`Docs: ${error.docsUrl}`);
    return lines.join('\n');
}
