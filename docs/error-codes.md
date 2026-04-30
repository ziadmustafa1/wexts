# Error Codes

Wexts errors include a code, message, suggested fix, and docs slug where available.

## RPC

- `WEXTS_RPC_MANIFEST_MISSING`: generated manifest was not provided to the client.
- `WEXTS_RPC_SERVICE_NOT_FOUND`: service is not in the generated manifest.
- `WEXTS_RPC_METHOD_NOT_FOUND`: method is not in the generated service.
- `WEXTS_RPC_REQUEST_FAILED`: `/rpc` request returned a non-2xx response.
- `WEXTS_API_REQUEST_FAILED`: legacy `FusionFetcher` request returned a non-2xx response.

## Codegen

- `WEXTS_CODEGEN_NO_SERVICES`: no decorated RPC services were found.

## Runtime

- `WEXTS_RUNTIME_NEXT_MISSING`: `nextDir` was configured but Next.js could not be loaded.

## CLI

- `WEXTS_CLI_GENERATOR_NAME_REQUIRED`: a named generator was called without a name.
- `WEXTS_CLI_GENERATOR_FILE_EXISTS`: generator refused to overwrite an existing file.

## Security

- `WEXTS_SECURITY_ERROR`: generic Wexts security error.
- `WEXTS_CONCURRENCY_LIMIT`: request rejected by concurrency limit.
