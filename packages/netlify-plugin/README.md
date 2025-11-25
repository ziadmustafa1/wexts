# @wexts/netlify-plugin

> **[📖 View Full Documentation](https://wexts.vercel.app)**

Official Netlify Build Plugin for WEXTS framework projects.

## Installation

### Automatic (Recommended)

The plugin will be automatically installed when Netlify detects a WEXTS project.

### Manual Installation

Add to your `netlify.toml`:

```toml
[[plugins]]
package = "@wexts/netlify-plugin"
```

Or install via npm:

```bash
pnpm add -D @wexts/netlify-plugin
```

## Configuration

### Basic Setup

Create a `netlify.toml` in your project root:

```toml
[build]
  command = "pnpm run build"
  publish = "apps/web/.next"

[[plugins]]
package = "@wexts/netlify-plugin"
```

### Advanced Configuration

Override default settings:

```toml
[[plugins]]
package = "@wexts/netlify-plugin"

  [plugins.inputs]
  frontendDir = "apps/web"
  backendDir = "apps/api"
  buildCommand = "turbo run build"
  publishDir = "apps/web/.next"
```

## Features

- ✅ Automatic WEXTS project detection
- ✅ Monorepo support (Turborepo, pnpm workspace)
- ✅ Next.js frontend optimization
- ✅ NestJS serverless functions support
- ✅ Build caching for faster deployments
- ✅ Helpful error messages

## How It Works

1. **onPreBuild**: Detects WEXTS project and restores cache
2. **onBuild**: Builds frontend and backend
3. **onPostBuild**: Saves cache for next deployment
4. **onSuccess**: Shows deployment summary
5. **onError**: Provides debugging information

## WEXTS Configuration

If you have a `wexts.config.ts`, the plugin will automatically use it:

```typescript
import { WextsConfig } from 'wexts-config';

const config: WextsConfig = {
  framework: 'wexts',
  version: '2.0.0',
  apps: {
    frontend: {
      dir: 'apps/web',
      framework: 'nextjs'
    },
    backend: {
      dir: 'apps/api',
      framework: 'nestjs'
    }
  },
  monorepo: {
    tool: 'turborepo'
  }
};

export default config;
```

## Environment Variables

Set these in your Netlify dashboard if needed:

- `NODE_VERSION`: Node.js version (default: 18)
- `PNPM_VERSION`: pnpm version (default: latest)

## Deploying

### Via Git

1. Connect your repository to Netlify
2. Netlify will auto-detect the plugin
3. Deploy!

### Via CLI

```bash
netlify deploy
```

## Troubleshooting

### Build fails with "Module not found"

Make sure all dependencies are in `package.json`'s `dependencies`, not `devDependencies`.

### Frontend not deploying

Check that `publishDir` points to the correct build output (usually `.next` for Next.js).

### Backend functions not working

Ensure your NestJS routes are compatible with Netlify Functions format.

## License

MIT
