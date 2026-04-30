# Troubleshooting

## `wexts.hello` Is Undefined Or Throws Manifest Missing

Run codegen and import the generated provider/client.

```bash
wexts generate -p apps/api -o apps/web/lib/wexts
```

Check that `apps/web/lib/wexts/wexts.rpc.manifest.json` exists.

## No RPC Services Found

Add `@RpcService()` to the class and `@RpcMethod()` to at least one method.

## Vercel Frozen Lockfile Failure

Regenerate the lockfile in the workspace Vercel deploys.

```bash
cd docs
pnpm install
pnpm install --frozen-lockfile
```

Commit the updated `pnpm-lock.yaml`.

## Clean Install Fails For `@wexts/security`

Install a Wexts version that depends on a published `@wexts/security` semver range. Published packages must not contain `workspace:*` dependencies.

## Generator Refuses To Overwrite

Review the existing file, then rerun with `--force` only if overwriting is intended.

```bash
wexts generate service billing --force
```
