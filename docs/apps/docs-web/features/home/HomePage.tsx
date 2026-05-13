'use client';

import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';
import {
    ArrowRight,
    Braces,
    CheckCircle2,
    Copy,
    Github,
    LockKeyhole,
    Package,
    Server,
    ShieldCheck,
    Terminal,
    Triangle,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stackBadges = ['Next.js 16', 'NestJS 11', 'React 19', 'Fastify 5', 'TypeScript 5.9', 'Vercel Output API'];

const pains = [
    'Separate frontend/backend wiring',
    'Duplicated API clients and contracts',
    'CORS, proxy, and port drift',
    'Unclear Vercel vs VPS deployment paths',
    'Runtime defaults that are hard to audit',
];

const solutions = [
    { title: 'Generated RPC', body: 'Explicit services produce a deterministic manifest and typed client.', icon: Braces },
    { title: 'One production server', body: 'Fastify serves Next, Nest, RPC, health checks, and Shield on one port.', icon: Server },
    { title: 'CLI workflow', body: 'Create, generate, build, doctor, start, and Vercel output through one CLI.', icon: Terminal },
    { title: 'Wexts Shield', body: 'Application-layer controls run before Next, Nest, and RPC.', icon: ShieldCheck },
];

const shield = ['Headers', 'CORS', 'CSRF', 'Rate limits', 'Body limits', 'Concurrency', 'Audit redaction'];

const limits = [
    'Development mode runs an API compiler watcher beside the Wexts runtime.',
    'Vercel mode is serverless and should be validated per application.',
    'WebSockets need VPS or another long-running runtime.',
    'Distributed rate limits need a shared store such as Redis.',
];

const createCommand = 'npx wexts create my-app';

export function HomePage() {
    return (
        <div className="site-surface min-h-screen overflow-x-hidden text-slate-100">
            <main>
                <Hero />
                <ProofStrip />
                <ProblemSolution />
                <Architecture />
                <RpcDemo />
                <CliWorkflow />
                <Deployment />
                <Security />
                <Limitations />
                <FinalCta />
            </main>
            <SiteFooter />
        </div>
    );
}

function Container({ className, children }: { className?: string; children: ReactNode }) {
    return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

function SectionHeader({
    eyebrow,
    title,
    body,
    className,
}: {
    eyebrow: string;
    title: string;
    body: string;
    className?: string;
}) {
    return (
        <div className={cn('max-w-3xl', className)}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-amber-300/80">{eyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-50 sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            <p className="mt-5 text-pretty text-base leading-7 text-slate-400 sm:text-lg">{body}</p>
        </div>
    );
}

function Hero() {
    const [copied, setCopied] = useState(false);

    async function copyCreateCommand() {
        await navigator.clipboard.writeText(createCommand);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    }

    return (
        <section className="relative isolate pt-12 sm:pt-16 lg:pt-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(214,179,92,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(93,122,255,0.12),transparent_28%)]" />
            <Container className="grid gap-10 pb-16 pt-10 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28">
                <div className="animate-[wexts-reveal_.7s_ease-out_both]">
                    <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5 text-sm text-amber-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                        Wexts 4 verified starter path
                    </div>
                    <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.055em] text-slate-50 sm:text-5xl lg:text-7xl">
                        Build Next.js + NestJS apps in one production runtime.
                    </h1>
                    <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:text-lg lg:text-xl">
                        Wexts gives you generated RPC, a single Fastify production server, Vercel Build Output support,
                        and application-layer protection through Wexts Shield.
                    </p>
                    <div className="mt-8 grid max-w-xl gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-2 shadow-2xl shadow-black/30 sm:grid-cols-[1fr_auto]">
                        <code className="min-w-0 overflow-x-auto whitespace-nowrap px-4 py-3 font-mono text-sm text-slate-200">
                            {createCommand}
                        </code>
                        <button
                            type="button"
                            onClick={copyCreateCommand}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                            aria-label={copied ? 'Install command copied' : 'Copy install command'}
                        >
                            <Copy className="h-4 w-4" />
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link className="btn-primary" href="/docs/getting-started">
                            Get started <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link className="btn-secondary" href="/docs">
                            View docs
                        </Link>
                        <Link className="btn-ghost" href="https://github.com/ziadmustafa1/wexts" target="_blank">
                            <Github className="h-4 w-4" /> GitHub
                        </Link>
                    </div>
                </div>
                <TerminalPreview />
            </Container>
        </section>
    );
}

function TerminalPreview() {
    return (
        <div className="animate-[wexts-reveal_.8s_ease-out_.12s_both] rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-3 shadow-2xl shadow-black/40">
            <div className="rounded-[1.35rem] border border-slate-800 bg-[#07090f]">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono text-xs text-slate-500">wexts.runtime.js</span>
                </div>
                <div className="grid gap-4 p-4 sm:p-5">
                    <CodeBlock
                        title="backend"
                        code={`@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string) {
    return \`Hello, \${name}!\`;
  }
}`}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {['/rpc → Wexts RPC', '/api → NestJS', '/* → Next.js'].map((item) => (
                            <div key={item} className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 font-mono text-xs text-slate-300">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProofStrip() {
    return (
        <section className="border-y border-slate-900/80 bg-slate-950/50">
            <Container className="flex flex-wrap items-center gap-2 py-4 sm:gap-3">
                <span className="mr-2 font-mono text-xs uppercase tracking-[0.24em] text-slate-500">Verified stack</span>
                {stackBadges.map((badge) => (
                    <span key={badge} className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-sm text-slate-300">
                        {badge}
                    </span>
                ))}
            </Container>
        </section>
    );
}

function ProblemSolution() {
    return (
        <section className="py-20 sm:py-28">
            <Container className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                <SectionHeader
                    eyebrow="Why Wexts"
                    title="Stop stitching two frameworks together by hand."
                    body="Next.js and NestJS are powerful together, but production wiring often becomes a private framework. Wexts makes the boundary explicit."
                />
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-red-300/10 bg-red-950/[0.08] p-5">
                        <h3 className="mb-4 text-lg font-semibold text-slate-100">Common friction</h3>
                        <ul className="space-y-3">
                            {pains.map((pain) => (
                                <li key={pain} className="flex gap-3 text-sm leading-6 text-slate-400">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-300/70" />
                                    {pain}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid gap-3">
                        {solutions.map((item) => (
                            <FeatureCard key={item.title} {...item} />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}

function FeatureCard({ title, body, icon: Icon }: { title: string; body: string; icon: ComponentType<{ className?: string }> }) {
    return (
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/35 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/25 hover:bg-slate-900/60">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-amber-200">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
        </div>
    );
}

function Architecture() {
    return (
        <section className="py-20 sm:py-28">
            <Container>
                <SectionHeader
                    eyebrow="Runtime"
                    title="One Fastify entrypoint. Three clear route surfaces."
                    body="Production traffic enters one runtime. Wexts Shield runs first, then routes split to generated RPC, Nest, or Next."
                />
                <div className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-950/60 p-4 sm:p-6">
                    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-5">
                            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Request path</p>
                            <div className="mt-6 space-y-4 font-mono text-sm">
                                <DiagramNode label="Browser" />
                                <DiagramArrow />
                                <DiagramNode label="Fastify runtime" highlight />
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <RouteCard path="/rpc" label="Wexts RPC" body="Manifest-driven service calls" />
                            <RouteCard path="/api" label="NestJS" body="Backend routes and modules" />
                            <RouteCard path="/*" label="Next.js" body="Frontend routes and assets" />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

function DiagramNode({ label, highlight }: { label: string; highlight?: boolean }) {
    return (
        <div className={cn('rounded-2xl border px-4 py-3', highlight ? 'border-amber-300/30 bg-amber-300/[0.06] text-amber-100' : 'border-slate-800 bg-slate-950 text-slate-200')}>
            {label}
        </div>
    );
}

function DiagramArrow() {
    return <div className="mx-6 h-8 border-l border-dashed border-slate-700" />;
}

function RouteCard({ path, label, body }: { path: string; label: string; body: string }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-[#07090f] p-5">
            <p className="font-mono text-sm text-amber-200">{path}</p>
            <h3 className="mt-4 text-lg font-semibold text-slate-100">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
        </div>
    );
}

function RpcDemo() {
    return (
        <section className="py-20 sm:py-28">
            <Container>
                <SectionHeader
                    eyebrow="RPC"
                    title="Typed calls without pretending every controller is automatic."
                    body="Wexts uses explicit decorators and generated files. The runtime reads manifests; it does not scan source files at request time."
                />
                <div className="mt-10 grid gap-4 lg:grid-cols-2">
                    <CodeBlock title="apps/api/src/hello.service.ts" code={`import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return \`Hello, \${name}!\`;
  }
}`} />
                    <CodeBlock title="apps/web/app/page.tsx" code={`'use client';

import { useWexts } from '@/lib/wexts-provider';

export default function Page() {
  const wexts = useWexts();

  async function run() {
    await wexts.hello.sayHello('Bob');
  }

  return <button onClick={run}>Say hello</button>;
}`} />
                </div>
            </Container>
        </section>
    );
}

function CliWorkflow() {
    return (
        <section className="py-20 sm:py-28">
            <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <SectionHeader
                    eyebrow="CLI"
                    title="A starter path you can actually verify."
                    body="The default create command generates the clean Wexts starter. Legacy compatibility templates stay behind an explicit flag."
                />
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-4">
                    <pre className="overflow-x-auto whitespace-pre rounded-2xl bg-[#07090f] p-5 font-mono text-sm leading-7 text-slate-200"><code>{`$ npx wexts create my-app
$ cd my-app
$ pnpm install
$ pnpm run dev

# release checks
$ pnpm run generate
$ pnpm run build
$ pnpm run doctor
$ pnpm run doctor:security`}</code></pre>
                </div>
            </Container>
        </section>
    );
}

function Deployment() {
    return (
        <section className="py-20 sm:py-28">
            <Container>
                <SectionHeader
                    eyebrow="Deploy"
                    title="Two supported production targets, named clearly."
                    body="Use the Node runtime where long-running processes matter. Use the Vercel Build Output path when the platform model fits your application."
                />
                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    <DeploymentCard icon={Server} title="VPS / Node" command="wexts start -c ./wexts.runtime.js" body="Single Fastify runtime with /health, /api/health, /rpc, /api, and Next routes." />
                    <DeploymentCard icon={Triangle} title="Vercel" command="wexts vercel-build" body="Build Output API support for Vercel deployments. Validate serverless behavior per app." />
                </div>
            </Container>
        </section>
    );
}

function DeploymentCard({ icon: Icon, title, command, body }: { icon: ComponentType<{ className?: string }>; title: string; command: string; body: string }) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-6">
            <Icon className="h-6 w-6 text-amber-200" />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-100">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
            <code className="mt-6 block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-200">
                {command}
            </code>
        </div>
    );
}

function Security() {
    return (
        <section className="py-20 sm:py-28">
            <Container>
                <SectionHeader
                    eyebrow="Wexts Shield"
                    title="Application-layer protection before your routes run."
                    body="Shield is intentionally scoped. It improves application behavior but does not replace provider or network-level defenses."
                />
                <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {shield.map((item) => (
                        <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/35 p-4">
                            <LockKeyhole className="mb-4 h-5 w-5 text-amber-200" />
                            <p className="font-medium text-slate-100">{item}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5 text-sm leading-6 text-amber-50">
                    Application-layer protection. Network-level DDoS still requires provider/WAF protection.
                </div>
            </Container>
        </section>
    );
}

function Limitations() {
    return (
        <section className="py-20 sm:py-28">
            <Container>
                <SectionHeader
                    eyebrow="Honest limits"
                    title="Production-focused does not mean magic."
                    body="Wexts is strongest when the runtime model is validated explicitly in your deployment environment."
                />
                <div className="mt-10 grid gap-3 md:grid-cols-2">
                    {limits.map((limit) => (
                        <div key={limit} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-5 text-sm leading-6 text-slate-300">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                            {limit}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

function FinalCta() {
    return (
        <section className="py-20 sm:py-28">
            <Container>
                <div className="rounded-[2rem] border border-slate-800 bg-[linear-gradient(135deg,rgba(245,195,93,0.12),rgba(15,23,42,0.75))] p-6 sm:p-10 lg:p-14">
                    <div className="max-w-3xl">
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-amber-200">Start verified</p>
                        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-50 sm:text-5xl">
                            Create the starter, inspect the runtime, ship with the checklist.
                        </h2>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link className="btn-primary" href="/docs/getting-started">Read the guide</Link>
                            <Link className="btn-secondary" href="https://www.npmjs.com/package/wexts" target="_blank">
                                <Package className="h-4 w-4" /> npm
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

function SiteFooter() {
    return (
        <footer className="border-t border-slate-900 py-10">
            <Container className="flex flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <img src="/wexts-logo-wordmark-transparent.png" alt="Wexts" className="h-8 w-28 shrink-0 object-contain object-left" />
                    <span>Production-focused Next.js + NestJS tooling.</span>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Link href="/docs">Docs</Link>
                    <Link href="/docs/known-limitations">Limitations</Link>
                    <Link href="https://github.com/ziadmustafa1/wexts" target="_blank">GitHub</Link>
                    <Link href="https://www.npmjs.com/package/wexts" target="_blank">npm</Link>
                </div>
            </Container>
        </footer>
    );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
    return (
        <div className="min-w-0 rounded-2xl border border-slate-800 bg-[#07090f]">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <span className="truncate font-mono text-xs text-slate-500">{title}</span>
                <Zap className="h-4 w-4 text-amber-200/80" />
            </div>
            <pre className="max-w-full overflow-x-auto p-4 text-sm leading-6 text-slate-200"><code>{code}</code></pre>
        </div>
    );
}
