# Installation

Wexts is installed as the `wexts` package. The security plugin is a real npm package and is installed as a dependency of `wexts`.

## Requirements

- Node.js 20.9 or newer
- pnpm 10 or newer
- Next.js 16 and React 19 for the official verified path
- NestJS 11 for API integration

## New Project

```bash
pnpm create vite my-shell --template vanilla-ts
cd my-shell
pnpm add wexts
```

For the verified repository example:

```bash
git clone https://github.com/ziadmustafa1/wexts.git
cd wexts
pnpm install
pnpm --filter wexts-example-hello-rpc generate
pnpm --filter wexts-example-hello-rpc build
```

## Existing Next + Nest Project

```bash
pnpm add wexts @wexts/security
pnpm add -D typescript
```

`@wexts/security` should remain a normal semver dependency. Do not use `workspace:*` in published package manifests.

## Verify

```bash
npx wexts --version
npx wexts --help
npx wexts doctor
```
