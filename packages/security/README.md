# Wexts Shield

`@wexts/security` provides a Fastify plugin for Wexts single-runtime servers. It is designed to run before Next, Nest, and RPC routes.

Included controls:
- Security headers
- Strict allowlist CORS
- CSRF checks for cookie-authenticated unsafe requests
- Body size checks
- Request timeout configuration support
- Route policies
- In-memory rate limiting
- Concurrency limiting
- RPC `requireAuth` default policy
- Redacted audit events

## Rate Limit Store

The default rate limit store is in-memory and protects one Node.js process only. In cluster or multi-instance deployments, each process keeps its own counters. Use the `rateLimitStore` adapter interface to provide a shared store for coordinated application-layer limits.

```ts
await registerWextsShield(app, {
  deployment: { mode: 'multi-instance' },
  rateLimitStore: {
    async increment(key, windowMs) {
      // Implement with a shared store such as Redis in your application.
      return { count: 1, resetAt: Date.now() + windowMs };
    },
  },
});
```

This package provides application-layer protection. It does not solve volumetric or network-level DDoS. Production deployments still need provider-level protection such as Cloudflare, a WAF, load balancer controls, or cloud-native DDoS protection.
