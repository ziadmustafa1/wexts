'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
    title: string;
    href: string;
    items: { title: string; href: string }[];
};

const navigation: NavItem[] = [
    {
        title: 'Start',
        href: '/docs/getting-started',
        items: [
            { title: 'Getting Started', href: '/docs/getting-started' },
            { title: 'Installation', href: '/docs/installation' },
            { title: 'Project Structure', href: '/docs/project-structure' },
        ],
    },
    {
        title: 'Core',
        href: '/docs/rpc',
        items: [
            { title: 'RPC', href: '/docs/rpc' },
            { title: 'Codegen', href: '/docs/codegen' },
            { title: 'Runtime', href: '/docs/runtime' },
            { title: 'CLI', href: '/docs/cli' },
            { title: 'Error Codes', href: '/docs/error-codes' },
        ],
    },
    {
        title: 'Operate',
        href: '/docs/vps-deployment',
        items: [
            { title: 'VPS Deployment', href: '/docs/vps-deployment' },
            { title: 'Vercel Deployment', href: '/docs/vercel-deployment' },
            { title: 'Wexts Shield', href: '/docs/wexts-shield' },
            { title: 'Troubleshooting', href: '/docs/troubleshooting' },
            { title: 'Known Limitations', href: '/docs/known-limitations' },
        ],
    },
    {
        title: 'Project',
        href: '/docs/migration-guide',
        items: [
            { title: 'Migration Guide', href: '/docs/migration-guide' },
            { title: 'Semver Policy', href: '/docs/semver-policy' },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            <div className="sticky top-16 z-30 border-b border-slate-900 bg-[#080a0f]/95 px-4 py-3 backdrop-blur lg:hidden">
                <details className="group rounded-2xl border border-slate-800 bg-slate-950">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-slate-100">
                        Docs navigation
                        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                    </summary>
                    <div className="grid gap-4 border-t border-slate-800 p-4">
                        {navigation.map((section) => (
                            <NavSection key={section.title} section={section} pathname={pathname} />
                        ))}
                    </div>
                </details>
            </div>
            <aside className="hidden w-72 shrink-0 border-r border-slate-900 bg-[#080a0f] lg:block">
                <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8">
                    <nav className="space-y-7" aria-label="Docs navigation">
                        {navigation.map((section) => (
                            <NavSection key={section.title} section={section} pathname={pathname} />
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}

function NavSection({ section, pathname }: { section: NavItem; pathname: string | null }) {
    return (
        <div>
            <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-slate-600">{section.title}</p>
            <div className="grid gap-1">
                {section.items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'rounded-xl px-3 py-2 text-sm leading-6 text-slate-400 transition hover:bg-slate-900 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300',
                            pathname === item.href && 'bg-amber-300/[0.08] text-amber-100'
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}
