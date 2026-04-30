import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, LockKeyhole, Rocket, Server, Terminal } from 'lucide-react';

const docCards = [
    {
        href: '/docs/getting-started',
        title: 'Getting Started',
        body: 'Create the verified starter, run the local workflow, and inspect the generated RPC path.',
        icon: Rocket,
    },
    {
        href: '/docs/rpc',
        title: 'RPC and Codegen',
        body: 'Use @RpcService(), @RpcMethod(), generated manifests, and useWexts() without runtime scanning.',
        icon: Code2,
    },
    {
        href: '/docs/runtime',
        title: 'Production Runtime',
        body: 'Serve RPC, NestJS, Next.js, health checks, and Shield through one Fastify entrypoint.',
        icon: Server,
    },
    {
        href: '/docs/wexts-shield',
        title: 'Wexts Shield',
        body: 'Configure application-layer headers, CORS, CSRF, limits, route policies, and redacted audit logs.',
        icon: LockKeyhole,
    },
    {
        href: '/docs/cli',
        title: 'CLI Reference',
        body: 'Use create, generate, build, start, vercel-build, doctor, and security checks predictably.',
        icon: Terminal,
    },
    {
        href: '/docs/known-limitations',
        title: 'Known Limitations',
        body: 'Understand dev/runtime differences, serverless constraints, WebSocket requirements, and shared stores.',
        icon: BookOpen,
    },
];

export function DocsIndexContent() {
    return (
        <article className="mdx-content">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300/80">Documentation</p>
            <h1 id="welcome">Build from the verified Wexts 4 path.</h1>
            <p className="text-xl leading-8 text-slate-300">
                Practical documentation for the starter, generated RPC, production runtime,
                Vercel Build Output support, VPS deployment, and Wexts Shield.
            </p>

            <div className="not-prose my-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                <div className="border-b border-slate-800 px-4 py-3 font-mono text-xs text-slate-500">verified starter</div>
                <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 text-slate-200"><code>{`npx wexts create my-app
cd my-app
pnpm install
pnpm run dev`}</code></pre>
            </div>

            <div className="not-prose my-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                {docCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group rounded-3xl border border-slate-800 bg-slate-900/30 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/25 hover:bg-slate-900/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                        >
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-amber-200">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-amber-200" />
                            </div>
                            <h2 className="text-xl font-semibold tracking-tight text-slate-100">{card.title}</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-400">{card.body}</p>
                        </Link>
                    );
                })}
            </div>
        </article>
    );
}
