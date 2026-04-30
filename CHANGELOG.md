# Changelog

All notable Wexts changes are documented here. This project follows Semantic Versioning for published packages.

## Unreleased

### Added

- Formal Wexts error classes with stable error codes, suggested fixes, and docs slugs.
- CLI scaffold generators for RPC services, services, modules, entities, guards, and runtime config.
- Default `wexts create` now generates a clean verified Hello RPC starter.
- Practical docs for installation, project structure, RPC, codegen, runtime, deployments, Wexts Shield, CLI, errors, troubleshooting, limitations, and migration.
- Community and release hygiene files for contribution, security reporting, roadmap, issue templates, release notes, semver policy, and breaking change review.

### Changed

- `wexts generate rpc <name>` now scaffolds an RPC service; `wexts generate` or `wexts generate rpc` without a name still generates the RPC manifest/client.
- Deprecated legacy templates are available only through `wexts create --template legacy`.

## 4.1.0

### Added

- Trust-layer documentation, errors, generators, community files, and create-starter hardening.

## 4.0.0

### Changed

- Package metadata now reports `wexts@4.0.0`.
- CLI version output is derived from package metadata instead of a hardcoded string.

## 3.0.3

### Fixed

- Prepared the `wexts` package to depend on published `@wexts/security` semver instead of workspace protocol.
- Verified clean artifact install for `wexts` and `@wexts/security`.

## 3.0.2

### Added

- Deterministic RPC manifest/client flow.
- `createWextsRpcClient()` and `useWexts<T>()`.
- Fastify production runtime with `/health`, `/api/health`, and `/rpc`.
- Wexts Shield package scaffold.
- Official `examples/hello-rpc` verification path.
- `doctor` and `doctor --security`.

### Notes

- This release is production-focused, not field-proven.
- Network-level DDoS protection requires provider/WAF protection.
- Legacy `demo/` and old templates are not canonical production references.
