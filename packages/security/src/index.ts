import type { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

export type RoutePolicyMode = 'public' | 'requireAuth' | 'deny';

export interface WextsShieldRoutePolicy {
  path: string;
  methods?: string[];
  mode: RoutePolicyMode;
  rateLimit?: RateLimitConfig;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface WextsShieldRateLimitStore {
  increment: (key: string, windowMs: number) => { count: number; resetAt: number } | Promise<{ count: number; resetAt: number }>;
}

export type WextsShieldDeploymentMode = 'single-process' | 'cluster' | 'multi-instance';

export interface WextsShieldAuditEvent {
  type: string;
  requestId: string;
  method: string;
  path: string;
  ip: string;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

export interface WextsShieldConfig {
  enabled?: boolean;
  production?: boolean;
  allowedOrigins?: string[];
  allowCredentials?: boolean;
  csrf?: {
    enabled?: boolean;
    cookieName?: string;
    headerName?: string;
  };
  bodyLimitBytes?: number;
  requestTimeoutMs?: number;
  rateLimit?: RateLimitConfig;
  rateLimitStore?: WextsShieldRateLimitStore;
  concurrencyLimit?: {
    max: number;
  };
  deployment?: {
    mode?: WextsShieldDeploymentMode;
  };
  warnings?: {
    log?: (warning: string) => void;
  };
  routePolicies?: WextsShieldRoutePolicy[];
  rpc?: {
    requireAuth?: boolean;
  };
  audit?: {
    enabled?: boolean;
    log?: (event: WextsShieldAuditEvent) => void;
  };
  redaction?: {
    fields?: string[];
  };
}

export class SecurityError extends Error {
  constructor(
    message: string,
    public statusCode = 403,
    public code = 'WEXTS_SECURITY_ERROR'
  ) {
    super(message);
    this.name = 'SecurityError';
  }
}

const DEFAULT_REDACTED_FIELDS = [
  'authorization',
  'cookie',
  'password',
  'token',
  'access_token',
  'refresh_token',
  'secret',
  'apiKey',
  'apikey',
];

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const wextsShield: FastifyPluginAsync<WextsShieldConfig> = async (fastify, inputConfig) => {
  const validationWarnings = validateWextsShieldConfig(inputConfig);
  const config = normalizeConfig(inputConfig);
  if (!config.enabled) return;

  const routePolicies = compilePolicies(config.routePolicies ?? []);
  const rateLimitStore = config.rateLimitStore;
  let activeRequests = 0;

  for (const warning of validationWarnings) {
    config.warnings.log!(warning);
  }

  fastify.addHook('onRequest', async (request, reply) => {
    activeRequests += 1;

    if (activeRequests > config.concurrencyLimit!.max) {
      activeRequests -= 1;
      throw new SecurityError('Too many concurrent requests', 503, 'WEXTS_CONCURRENCY_LIMIT');
    }

    applySecurityHeaders(reply);
    applyCors(request, reply, config);
    enforceRequestSize(request, config);
    enforceRoutePolicy(request, routePolicies, config);
    await enforceRateLimit(request, rateLimitStore, routePolicies, config);
    enforceCsrf(request, config);
  });

  fastify.addHook('onResponse', async (request, reply) => {
    activeRequests = Math.max(0, activeRequests - 1);
    writeAudit(config, request, {
      type: 'request',
      statusCode: reply.statusCode,
    });
  });

  fastify.addHook('onError', async (request, _reply, error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    writeAudit(config, request, {
      type: 'security_error',
      metadata: redactObject({ error: error.message, code: (error as SecurityError).code }, config),
    });
  });

  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof SecurityError) {
      reply.status(error.statusCode).send({ error: error.code, message: error.message });
      return;
    }

    reply.send(error);
  });
};

export const WextsShield = wextsShield;

export function validateWextsShieldConfig(config: WextsShieldConfig): string[] {
  const warnings: string[] = [];
  const mode = config.deployment?.mode ?? 'single-process';

  if ((mode === 'cluster' || mode === 'multi-instance') && !config.rateLimitStore) {
    warnings.push('Wexts Shield is using the in-memory rate limit store in cluster/multi-instance mode. This only protects each process independently; provide a shared store adapter for coordinated application-layer limits.');
  }

  return warnings;
}

export function redactObject<T>(value: T, config: Pick<WextsShieldConfig, 'redaction'> = {}): T {
  const fields = new Set([...(config.redaction?.fields ?? []), ...DEFAULT_REDACTED_FIELDS].map((field) => field.toLowerCase()));

  if (Array.isArray(value)) {
    return value.map((item) => redactObject(item, config)) as T;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const result: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (fields.has(key.toLowerCase())) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = redactObject(nestedValue, config);
    }
  }

  return result as T;
}

function normalizeConfig(config: WextsShieldConfig): Required<Omit<WextsShieldConfig, 'routePolicies' | 'redaction'>> & Pick<WextsShieldConfig, 'routePolicies' | 'redaction'> {
  return {
    enabled: config.enabled ?? true,
    production: config.production ?? process.env.NODE_ENV === 'production',
    allowedOrigins: config.allowedOrigins ?? [],
    allowCredentials: config.allowCredentials ?? false,
    csrf: {
      enabled: config.csrf?.enabled ?? true,
      cookieName: config.csrf?.cookieName ?? 'wexts_csrf',
      headerName: config.csrf?.headerName ?? 'x-wexts-csrf',
    },
    bodyLimitBytes: config.bodyLimitBytes ?? 1_048_576,
    requestTimeoutMs: config.requestTimeoutMs ?? 30_000,
    rateLimit: config.rateLimit ?? { windowMs: 60_000, max: 120 },
    rateLimitStore: config.rateLimitStore ?? createMemoryRateLimitStore(),
    concurrencyLimit: config.concurrencyLimit ?? { max: 100 },
    deployment: {
      mode: config.deployment?.mode ?? 'single-process',
    },
    warnings: {
      log: config.warnings?.log ?? ((warning) => {
        process.stderr.write(`${warning}\n`);
      }),
    },
    routePolicies: config.routePolicies ?? [],
    rpc: {
      requireAuth: config.rpc?.requireAuth ?? true,
    },
    audit: {
      enabled: config.audit?.enabled ?? true,
      log: config.audit?.log ?? ((event) => {
        process.stdout.write(`${JSON.stringify(event)}\n`);
      }),
    },
    redaction: config.redaction,
  };
}

function applySecurityHeaders(reply: FastifyReply): void {
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  reply.header('Cross-Origin-Opener-Policy', 'same-origin');
  reply.header('Cross-Origin-Resource-Policy', 'same-origin');
  reply.header('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'");
  reply.header('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
}

function applyCors(request: FastifyRequest, reply: FastifyReply, config: ReturnType<typeof normalizeConfig>): void {
  const origin = request.headers.origin;
  if (!origin) return;

  if (!config.allowedOrigins.includes(origin)) {
    throw new SecurityError('Origin is not allowed', 403, 'WEXTS_CORS_BLOCKED');
  }

  reply.header('Access-Control-Allow-Origin', origin);
  reply.header('Vary', 'Origin');
  reply.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'content-type,authorization,x-wexts-csrf');

  if (config.allowCredentials) {
    reply.header('Access-Control-Allow-Credentials', 'true');
  }

  if (request.method === 'OPTIONS') {
    reply.status(204).send();
  }
}

function enforceRequestSize(request: FastifyRequest, config: ReturnType<typeof normalizeConfig>): void {
  const contentLength = request.headers['content-length'];
  if (!contentLength) return;

  const bytes = Number(contentLength);
  if (Number.isFinite(bytes) && bytes > config.bodyLimitBytes) {
    throw new SecurityError('Request body too large', 413, 'WEXTS_BODY_LIMIT');
  }
}

function enforceRoutePolicy(
  request: FastifyRequest,
  routePolicies: CompiledPolicy[],
  config: ReturnType<typeof normalizeConfig>
): void {
  const policy = findPolicy(request, routePolicies);
  const path = getPath(request);
  const mode = policy?.mode ?? (path.startsWith('/rpc') && config.rpc.requireAuth ? 'requireAuth' : 'public');

  if (mode === 'deny') {
    throw new SecurityError('Route is denied by policy', 403, 'WEXTS_ROUTE_DENIED');
  }

  if (mode === 'requireAuth' && !hasAuth(request)) {
    throw new SecurityError('Authentication required', 401, 'WEXTS_AUTH_REQUIRED');
  }
}

async function enforceRateLimit(
  request: FastifyRequest,
  store: WextsShieldRateLimitStore,
  routePolicies: CompiledPolicy[],
  config: ReturnType<typeof normalizeConfig>
): Promise<void> {
  const routePolicy = findPolicy(request, routePolicies);
  const limit = routePolicy?.rateLimit ?? config.rateLimit;
  const key = `${request.ip}:${getPath(request)}`;
  const current = await store.increment(key, limit.windowMs);

  if (current.count > limit.max) {
    throw new SecurityError('Rate limit exceeded', 429, 'WEXTS_RATE_LIMIT');
  }
}

function enforceCsrf(request: FastifyRequest, config: ReturnType<typeof normalizeConfig>): void {
  if (!config.csrf.enabled || !UNSAFE_METHODS.has(request.method.toUpperCase())) return;
  if (!usesCookieAuth(request)) return;

  const cookieToken = getCookie(request, config.csrf.cookieName!);
  const headerToken = request.headers[config.csrf.headerName!] as string | undefined;
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw new SecurityError('Invalid CSRF token', 403, 'WEXTS_CSRF_BLOCKED');
  }
}

function writeAudit(
  config: ReturnType<typeof normalizeConfig>,
  request: FastifyRequest,
  event: Pick<WextsShieldAuditEvent, 'type' | 'statusCode' | 'metadata'>
): void {
  if (!config.audit.enabled) return;

  config.audit.log!({
    type: event.type,
    requestId: request.id,
    method: request.method,
    path: getPath(request),
    ip: request.ip,
    statusCode: event.statusCode,
    metadata: redactObject({
      ...event.metadata,
      headers: request.headers,
    }, config),
  });
}

interface CompiledPolicy extends WextsShieldRoutePolicy {
  matches: (request: FastifyRequest) => boolean;
}

function compilePolicies(policies: WextsShieldRoutePolicy[]): CompiledPolicy[] {
  return policies.map((policy) => ({
    ...policy,
    methods: policy.methods?.map((method) => method.toUpperCase()),
    matches: (request) => {
      const path = getPath(request);
      const methodMatches = !policy.methods || policy.methods.map((method) => method.toUpperCase()).includes(request.method.toUpperCase());
      if (!methodMatches) return false;
      if (policy.path.endsWith('*')) return path.startsWith(policy.path.slice(0, -1));
      return path === policy.path;
    },
  }));
}

function findPolicy(request: FastifyRequest, policies: CompiledPolicy[]): CompiledPolicy | undefined {
  return policies.find((policy) => policy.matches(request));
}

function getPath(request: FastifyRequest): string {
  return request.url.split('?')[0] || '/';
}

function hasAuth(request: FastifyRequest): boolean {
  const authorization = request.headers.authorization;
  return Boolean(authorization?.startsWith('Bearer ') || getCookie(request, 'access_token') || getCookie(request, 'wexts_token'));
}

function usesCookieAuth(request: FastifyRequest): boolean {
  return Boolean(request.headers.cookie && !request.headers.authorization);
}

function getCookie(request: FastifyRequest, name: string): string | undefined {
  const cookie = request.headers.cookie;
  if (!cookie) return undefined;

  for (const part of cookie.split(';')) {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (rawKey === name) return decodeURIComponent(rawValue.join('='));
  }

  return undefined;
}

export async function registerWextsShield(fastify: FastifyInstance, config: WextsShieldConfig = {}) {
  await wextsShield(fastify, config);
}

function createMemoryRateLimitStore(): WextsShieldRateLimitStore {
  const counters = new Map<string, { count: number; resetAt: number }>();

  return {
    increment(key, windowMs) {
      const now = Date.now();
      const current = counters.get(key);

      if (!current || current.resetAt <= now) {
        const next = { count: 1, resetAt: now + windowMs };
        counters.set(key, next);
        return next;
      }

      current.count += 1;
      return current;
    },
  };
}
