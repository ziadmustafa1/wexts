import Fastify from 'fastify';
import { describe, expect, it, vi } from 'vitest';
import { registerWextsShield, redactObject, validateWextsShieldConfig, WextsSecurityError } from './index';

describe('Wexts Shield', () => {
  it('blocks abuse with in-memory rate limits', async () => {
    const app = Fastify();
    await registerWextsShield(app, {
      allowedOrigins: ['https://app.example.com'],
      rateLimit: { windowMs: 60_000, max: 1 },
      audit: { enabled: false },
      rpc: { requireAuth: false },
    });
    app.get('/health', async () => ({ ok: true }));

    expect((await app.inject('/health')).statusCode).toBe(200);
    expect((await app.inject('/health')).statusCode).toBe(429);
  });

  it('blocks invalid CSRF for cookie-auth mutations', async () => {
    const app = Fastify();
    await registerWextsShield(app, {
      allowedOrigins: ['https://app.example.com'],
      audit: { enabled: false },
      rpc: { requireAuth: false },
    });
    app.post('/api/session', async () => ({ ok: true }));

    const response = await app.inject({
      method: 'POST',
      url: '/api/session',
      headers: {
        cookie: 'access_token=abc; wexts_csrf=expected',
      },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().error).toBe('WEXTS_CSRF_BLOCKED');
  });

  it('blocks private RPC without auth', async () => {
    const app = Fastify();
    await registerWextsShield(app, {
      audit: { enabled: false },
      rpc: { requireAuth: true },
    });
    app.post('/rpc/private/hello', async () => ({ data: 'hello' }));

    expect((await app.inject({ method: 'POST', url: '/rpc/private/hello' })).statusCode).toBe(401);
  });

  it('redacts sensitive audit fields', async () => {
    expect(redactObject({
      password: 'secret',
      nested: {
        authorization: 'Bearer abc',
        safe: 'value',
      },
    })).toEqual({
      password: '[REDACTED]',
      nested: {
        authorization: '[REDACTED]',
        safe: 'value',
      },
    });
  });

  it('emits audit logs with redacted headers', async () => {
    const log = vi.fn();
    const app = Fastify();
    await registerWextsShield(app, {
      audit: { enabled: true, log },
      rpc: { requireAuth: false },
    });
    app.get('/health', async () => ({ ok: true }));

    await app.inject({
      method: 'GET',
      url: '/health',
      headers: { authorization: 'Bearer secret' },
    });

    expect(log).toHaveBeenCalledWith(expect.objectContaining({
      metadata: expect.objectContaining({
        headers: expect.objectContaining({ authorization: '[REDACTED]' }),
      }),
    }));
  });

  it('warns when cluster mode uses the memory rate-limit store', () => {
    expect(validateWextsShieldConfig({
      deployment: { mode: 'cluster' },
    })).toEqual([
      'Wexts Shield is using the in-memory rate limit store in cluster/multi-instance mode. This only protects each process independently; provide a shared store adapter for coordinated application-layer limits.',
    ]);
  });

  it('does not warn for cluster mode when a store adapter is supplied', () => {
    expect(validateWextsShieldConfig({
      deployment: { mode: 'cluster' },
      rateLimitStore: {
        increment: () => ({ count: 1, resetAt: Date.now() + 1000 }),
      },
    })).toEqual([]);
  });

  it('exports a formal WextsSecurityError with code and suggested fix', () => {
    const error = new WextsSecurityError('Blocked', 403, 'WEXTS_SECURITY_BLOCKED', {
      suggestedFix: 'Update the route policy.',
      docsSlug: 'wexts-shield',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('WEXTS_SECURITY_BLOCKED');
    expect(error.suggestedFix).toBe('Update the route policy.');
    expect(error.docsSlug).toBe('wexts-shield');
  });
});
