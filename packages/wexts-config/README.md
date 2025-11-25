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
