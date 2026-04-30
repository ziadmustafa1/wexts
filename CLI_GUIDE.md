# Wexts CLI Guide

The current published CLI is Wexts 4.

```bash
npx wexts --version
npx wexts --help
npx wexts create my-app
cd my-app
pnpm install
pnpm run dev
```

Core commands:

```bash
wexts create my-app
wexts dev
wexts generate
wexts generate rpc hello
wexts build
wexts start
wexts vercel-build
wexts doctor
wexts doctor --security
```

Deprecated compatibility scaffolding is available only through:

```bash
wexts create my-app --template legacy
```
