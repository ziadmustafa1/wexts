# @wexts/vercel-builder

> **[📖 View Full Documentation](https://wexts.vercel.app)**

Official Vercel builder for WEXTS framework projects.

## Installation

This package is automatically detected by Vercel when your project uses WEXTS.

## Manual Installation

If you want to explicitly use this builder:

```bash
pnpm add -D @wexts/vercel-builder
```

Then in your `package.json`:

```json
{
  "vercel": {
    "framework": "wexts"
  }
}
```

## Features

- ✅ Automatic WEXTS project detection
- ✅ Monorepo support (Turborepo, pnpm workspace, etc.)
- ✅ Optimized caching
- ✅ Next.js frontend support
- ✅ NestJS backend support
- ✅ Type-safe configuration

## Configuration

Create a `wexts.config.ts` file in your project root:

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

## How It Works

1. **Detection**: Vercel automatically detects WEXTS projects by checking for:
   - `wexts.config.ts`
   - `wexts` in package.json dependencies
   - `vercel.framework = "wexts"` in package.json

2. **Analysis**: Reads your WEXTS config to understand project structure

3. **Building**: Delegates to framework-specific builders (Next.js, NestJS)

4. **Caching**: Optimizes build times with smart caching

## License

MIT
