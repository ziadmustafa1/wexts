# Migration Guide

Use the root `MIGRATION.md` and `docs/migration-guide.md` files for the current Wexts 4 migration path.

The supported direction is:

1. Start from the verified starter created by `wexts create my-app`.
2. Add explicit backend services with `@RpcService()` and `@RpcMethod()`.
3. Run `wexts generate`.
4. Call generated services with `useWexts()`.
5. Deploy with `wexts start` on VPS/Node or `wexts vercel-build` on Vercel.
