import { Badge } from '@/components/ui/badge';

type DocPage = {
    summary: string;
    commands?: string[];
    bullets: string[];
};

const docs: Record<string, DocPage> = {
    installation: {
        summary: 'Install Wexts 4 with the published CLI and the verified starter.',
        commands: ['npx wexts create my-app', 'cd my-app', 'pnpm install', 'pnpm run dev'],
        bullets: [
            'The default starter is the verified Hello RPC path.',
            'Deprecated compatibility scaffolding is available only with `--template legacy`.',
            'Run `pnpm run generate`, `pnpm run build`, `pnpm run doctor`, and `pnpm run doctor:security` before deployment.',
        ],
    },
    'project-structure': {
        summary: 'The verified starter keeps the Next app, Nest app, runtime config, and generated RPC output explicit.',
        commands: ['apps/api', 'apps/web', 'apps/web/lib/wexts', 'wexts.runtime.js', 'pnpm-workspace.yaml'],
        bullets: [
            '`apps/api` contains Nest services decorated with `@RpcService()` and `@RpcMethod()`.',
            '`apps/web` contains the Next frontend and generated Wexts client files.',
            '`wexts.runtime.js` is used by production runtime and deployment checks.',
        ],
    },
    rpc: {
        summary: 'Wexts RPC is generated from explicit service metadata, not runtime scanning.',
        commands: ['@RpcService({ name: "hello", requireAuth: false })', '@RpcMethod()', 'const wexts = useWexts();', 'await wexts.hello.sayHello("Bob");'],
        bullets: [
            'Run `wexts generate` after adding or changing RPC services.',
            'Service names are stable and come from the generated manifest.',
            'Private RPC services can require auth through Wexts RPC policy metadata.',
        ],
    },
    codegen: {
        summary: 'Codegen discovers explicit RPC metadata and emits deterministic client files.',
        commands: ['wexts generate -p apps/api -o apps/web/lib/wexts', 'wexts generate rpc hello'],
        bullets: [
            'Production start does not run codegen.',
            'Codegen fails clearly when no RPC services are found.',
            'Generated files should be committed or produced during the build pipeline.',
        ],
    },
    runtime: {
        summary: 'Production runtime serves Fastify, Wexts Shield, Nest under /api, RPC under /rpc, Next routes, and health checks on one port.',
        commands: ['pnpm run build', 'PORT=3210 pnpm run start', 'curl http://127.0.0.1:3210/health', 'curl http://127.0.0.1:3210/api/health'],
        bullets: [
            'Development mode starts an API compiler watcher beside the Wexts runtime, keeping `/rpc` on the web origin.',
            'Runtime startup uses generated manifests and compiled config.',
            'No source scanning, file watching, or codegen should run during production start.',
        ],
    },
    cli: {
        summary: 'The CLI owns starter creation, dev orchestration, generation, build, runtime start, Vercel output, and doctor checks.',
        commands: ['wexts create my-app', 'wexts dev', 'wexts generate', 'wexts build', 'wexts start', 'wexts vercel-build', 'wexts doctor --security'],
        bullets: [
            '`wexts create` creates the verified starter by default.',
            '`--template legacy` is deprecated compatibility scaffolding.',
            'Commands should fail non-zero on real errors and avoid silent success.',
        ],
    },
    'error-codes': {
        summary: 'Formal Wexts errors include a code, message, suggested fix, and docs slug.',
        bullets: [
            '`WextsRpcError` covers client and RPC routing failures.',
            '`WextsCodegenError` covers manifest and generation failures.',
            '`WextsRuntimeError` covers production runtime startup and request errors.',
            '`WextsSecurityError` covers Wexts Shield policy failures.',
        ],
    },
    troubleshooting: {
        summary: 'Start from generated files, doctor output, and health endpoints before changing runtime code.',
        commands: ['pnpm run generate', 'pnpm run doctor', 'pnpm run doctor:security', 'pnpm run build'],
        bullets: [
            'If a service is missing, verify both `@RpcService()` and `@RpcMethod()` are present.',
            'If the client is stale, regenerate and rebuild.',
            'If production routing fails, check `wexts.runtime.js` and the generated manifest path.',
        ],
    },
    'known-limitations': {
        summary: 'Wexts is production-focused, but not a universal production guarantee.',
        bullets: [
            'The verified path is the create/hello-rpc starter path.',
            'Wexts Shield is application-layer protection, not network-level DDoS protection.',
            'The in-memory security store is single-process only.',
            'Vercel/serverless behavior should be validated for each application.',
        ],
    },
    'vps-deployment': {
        summary: 'Use `wexts start` for VPS or Node hosting after the build and doctor checks pass.',
        commands: ['pnpm run build', 'PORT=3210 pnpm run start'],
        bullets: [
            'Run behind a reverse proxy or load balancer as appropriate.',
            'Provide network-level protection through Cloudflare, a WAF, or provider controls.',
            'Use `/health` and `/api/health` for smoke checks.',
        ],
    },
    'vercel-deployment': {
        summary: 'Use `wexts vercel-build` for Vercel Build Output API deployments.',
        commands: ['pnpm run vercel-build'],
        bullets: [
            'This path is distinct from the VPS `wexts start` process.',
            'Validate cold start, function duration, and platform routing for each app.',
            'Do not market serverless output as identical to the single Node runtime.',
        ],
    },
    'wexts-shield': {
        summary: 'Wexts Shield runs before Next, Nest, and RPC as application-layer protection.',
        bullets: [
            'Includes security headers, strict CORS, CSRF for cookie auth, body limits, request timeouts, route policies, rate limits, concurrency limits, and audit redaction.',
            'The default memory store is single-process only.',
            'Network-level DDoS requires Cloudflare, WAF, load balancer controls, or provider protection.',
        ],
    },
    'migration-guide': {
        summary: 'Migrate incrementally by introducing explicit Wexts RPC services and generated clients.',
        commands: ['wexts generate rpc hello', 'wexts generate', 'pnpm run build'],
        bullets: [
            'Do not expose arbitrary Nest controllers automatically.',
            'Keep existing routes while validating the generated RPC boundary.',
            'Use the verified starter as the reference structure.',
        ],
    },
    'semver-policy': {
        summary: 'Published packages follow semver and release gates.',
        bullets: [
            'Breaking public API changes require a major version.',
            'New compatible CLI/docs/runtime features use minor versions.',
            'Bug fixes and release-blocker fixes use patch versions.',
            'No package should publish unless install, typecheck, tests, lint, build, artifact checks, and smoke checks pass.',
        ],
    },
};

type MarkdownDocContentProps = {
    slug: string;
    title: string;
};

export function MarkdownDocContent({ slug, title }: MarkdownDocContentProps) {
    const page = docs[slug];

    if (!page) {
        throw new Error(`Missing docs content for ${slug}`);
    }

    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
                    Wexts 4
                </Badge>
                <h1 id={slug}>{title}</h1>
                <p className="text-xl text-muted-foreground">{page.summary}</p>
            </div>

            {page.commands && (
                <>
                    <h2 id="commands">Commands and Examples</h2>
                    <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
                        <code>{page.commands.join('\n')}</code>
                    </pre>
                </>
            )}

            <h2 id="notes">Current Guidance</h2>
            <ul>
                {page.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                ))}
            </ul>
        </article>
    );
}
