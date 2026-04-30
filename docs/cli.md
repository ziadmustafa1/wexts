# CLI

## Version and Help

```bash
wexts --version
wexts --help
```

## Create

```bash
wexts create my-app --skip-install
```

The default scaffold is the verified Wexts starter based on `examples/hello-rpc`.

Deprecated compatibility templates are available only through:

```bash
wexts create my-legacy-app --template legacy
```

## Dev

```bash
wexts dev -a apps/api -w apps/web --api-port 5050 --port 3000
```

Dev mode uses separate processes.

## Generate RPC Client

```bash
wexts generate -p apps/api -o apps/web/lib/wexts
```

## Generators

```bash
wexts generate rpc hello
wexts generate service billing
wexts generate module billing
wexts generate entity billing
wexts generate guard auth
wexts generate config
```

Generators refuse to overwrite existing files unless `--force` is passed.

```bash
wexts generate rpc hello --force
```

## Build and Start

```bash
wexts build
wexts start -c ./wexts.runtime.js -p 3210
```

## Doctor

```bash
wexts doctor
wexts doctor --security
```
