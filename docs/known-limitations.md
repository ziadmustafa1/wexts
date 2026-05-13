# Known Limitations

- The verified canonical example is `examples/hello-rpc`.
- Legacy `demo/` and bundled templates are compatibility paths, not production recommendations.
- Dev mode starts an API compiler watcher alongside the Wexts runtime; generated manifests and compiled API services must still be available before RPC handlers can run.
- Development and production both serve browser RPC on the web origin, but development still depends on a compiler watcher and pre-generated manifests.
- RPC generation requires explicit Wexts decorators.
- Codegen must run before production start.
- Runtime does not scan source files.
- In-memory rate/concurrency limits are single-process only.
- Wexts Shield is not network-level DDoS protection.
- Vercel/serverless deployments need platform-specific validation before production claims.
