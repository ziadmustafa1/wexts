# Changelog

All notable changes to Wexts Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-23

### 🎯 Major Version Update

v2.0.0 represents a complete modernization of the Wexts Framework with breaking changes.

### ⚡ Breaking Changes

- **Minimum Requirements Changed:**
  - Node.js: `18.x` → `20.9.0+`
  - PNPM: Any version → `10.0.0+`
  - TypeScript: `5.3.x` → `5.9.x`
  
- **Framework Version Updates:**
  - Next.js: `14.x/15.x/16.x` → `16.x` only
  - NestJS: `10.x` → `11.x` only
  - React: `18.x/19.x` → `19.x` only

- **API Changes:**
  - Next.js 16 async request APIs: `headers()`, `cookies()`, `params()` are now async
  - Removed support for Next.js Pages Router (App Router only)
  - TypeScript `target` updated to ES2023

### ✨ Added

- **Build System:**
  - Added minification for production builds
  - Target Node.js 20 specifically
  - Enhanced TypeScript configuration with `noUncheckedIndexedAccess`
  - Added `verbatimModuleSyntax` support

- **Developer Experience:**
  - Added `typecheck` npm script
  - Added `test:watch` for continuous testing
  - Improved Turbo configuration with environment variable handling
  - Added `.npmrc` for optimized PNPM workspace configuration

- **Testing:**
  - Updated Vitest to v2.1.8 with enhanced configuration
  - Added coverage reporting with v8 provider
  - Better test file organization

- **Dependencies:**
  - `commander`: `11.x` → `12.1.0`
  - `inquirer`: `9.x` → `12.4.0`
  - `chokidar`: `3.x` → `4.0.3`
  - `consola`: Added `3.2.3` for better logging
  - `tsup`: `8.0.0` → `8.3.5`
  - `@types/react`: `18.x` → `19.0.6`
  - `turbo`: `2.0.0` → `2.3.3`
  - `tailwindcss`: `4.1.17` → `4.2.0`

### 🔧 Changed

- Updated package description to reflect modern framework status
- Improved README with v2 highlights and requirements
- Enhanced TypeScript compiler options for better type safety
- Updated peer dependencies to only support latest versions

### 📦 Infrastructure

- Monorepo structure optimized for Turbo 2.x
- Better caching strategies with `globalEnv` configuration
- Improved build outputs specification
- Enhanced workspace protocol usage (`workspace:*`)

### 📝 Documentation

- Added requirements section to README
- Updated all examples to use Next.js 16 and NestJS 11
- Added "What's New in v2" section
- Improved inline code documentation

### 🐛 Fixed

- Fixed PNPM workspace configuration
- Improved package.json structure
- Fixed TypeScript configuration inconsistencies
- Enhanced tsup configuration for better builds

## [1.0.1] - 2024

### Fixed
- Minor bug fixes and improvements

## [1.0.0] - 2024

### Added
- Initial release of Wexts Framework
- NestJS 10 integration
- Next.js 14/15 support
- Auto API client generation
- Type-safe full-stack development
- CLI tools for scaffolding
- Development server with proxy
- Basic documentation

---

## Migration Guides

### Migrating from v1.x to v2.0

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

### Upgrade Checklist

- [ ] Update Node.js to 20.9.0 or higher
- [ ] Update PNPM to 10.0.0 or higher
- [ ] Update all framework peer dependencies
- [ ] Migrate Next.js async APIs if using `headers()`, `cookies()`, etc.
- [ ] Update NestJS decorators if needed for v11
- [ ] Run `pnpm install` to update all dependencies
- [ ] Run `pnpm typecheck` to verify TypeScript compatibility
- [ ] Run tests to ensure compatibility
