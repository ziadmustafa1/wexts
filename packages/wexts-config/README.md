# @wexts/config

> **[📖 View Full Documentation](https://wexts.vercel.app)**

TypeScript configuration schema and utilities for WEXTS framework projects.

## Installation

```bash
pnpm add @wexts/config
```

## Usage

### Defining Configuration

Create a `wexts.config.ts` file in your project root:

```typescript
import { WextsConfig } from '@wexts/config';

const config: WextsConfig = {
  framework: 'wexts',
  version: '2.0.0',
  
  apps: {
    frontend: {
      dir: 'apps/web',
      framework: 'nextjs',
      port: 3000
    },
    backend: {
      dir: 'apps/api',
      framework: 'nestjs',
      port: 3001
    }
  },
  
  monorepo: {
    tool: 'turborepo'
  }
};

export default config;
```

### Loading Configuration

```typescript
import { loadWextsConfig } from '@wexts/config';

const config = await loadWextsConfig(process.cwd());
if (config) {
  console.log('Frontend:', config.apps.frontend.framework);
  console.log('Backend:', config.apps.backend.framework);
}
```

### Framework Detection

```typescript
import { detectWexts } from '@wexts/config';

const isWextsProject = await detectWexts(process.cwd());
console.log('Is WEXTS project?', isWextsProject);
```

## API

### `WextsConfig`

Main configuration interface with the following properties:

- `framework`: Always `'wexts'`
- `version`: Framework version
- `apps.frontend`: Frontend app configuration
- `apps.backend`: Backend app configuration
- `monorepo`: Monorepo tool configuration
- `deployment`: Optional deployment settings

### `loadWextsConfig(rootDir: string): Promise<WextsConfig | null>`

Loads and validates WEXTS configuration from the specified directory.

### `detectWexts(rootDir: string): Promise<boolean>`

Detects if a project uses WEXTS framework by checking:
- `wexts.config.ts` existence
- `wexts` in package.json dependencies
- Vercel framework preset

## License

MIT
