# Wexts Shield

Wexts Shield is provided by `@wexts/security`. It runs before Next, Nest, and RPC when registered by the Wexts runtime.

## Features

- Security headers
- Strict CORS
- CSRF checks for cookie-auth unsafe methods
- Body size limit
- Request timeout
- Route policies
- RPC `requireAuth` policy
- In-memory rate limiting
- In-memory concurrency limiting
- Audit logs
- Sensitive field redaction

## Config

```js
security: {
  enabled: true,
  production: true,
  allowedOrigins: ['https://app.example.com'],
  csrf: { enabled: true },
  rateLimit: { windowMs: 60_000, max: 120 },
  concurrencyLimit: { max: 100 },
  audit: { enabled: true },
}
```

## Single-Process Limitation

The default memory store protects one process only. Cluster or multi-instance deployments need a shared store adapter.

## DDoS Clarification

Wexts Shield provides application-layer protection. Network-level DDoS requires Cloudflare, a WAF, load balancer controls, or cloud/provider protection.
