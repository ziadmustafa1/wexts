'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Menu, Package, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/docs', label: 'Docs' },
    { href: '/docs/rpc', label: 'RPC' },
    { href: '/docs/runtime', label: 'Runtime' },
    { href: '/docs/wexts-shield', label: 'Shield' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/80 bg-[#080a0f]/85 backdrop-blur-xl">
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
                <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
                    <img
                        src="/wexts-logo-wordmark-transparent.png"
                        alt="Wexts"
                        className="h-8 w-28 shrink-0 object-contain object-left sm:w-32"
                    />
                </Link>

                <div className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'rounded-full px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300',
                                pathname === item.href && 'bg-slate-900 text-slate-100'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Link className="nav-icon" href="https://github.com/ziadmustafa1/wexts" target="_blank" aria-label="Wexts on GitHub">
                        <Github className="h-4 w-4" />
                    </Link>
                    <Link className="nav-icon" href="https://www.npmjs.com/package/wexts" target="_blank" aria-label="Wexts on npm">
                        <Package className="h-4 w-4" />
                    </Link>
                    <Link className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" href="/docs/getting-started">
                        Get started
                    </Link>
                </div>

                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-200 md:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={open}
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {open && (
                <div className="border-t border-slate-900 bg-[#080a0f] px-4 py-4 md:hidden">
                    <div className="grid gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-xl px-3 py-3 text-base text-slate-200 hover:bg-slate-900"
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <Link className="btn-secondary justify-center" href="https://github.com/ziadmustafa1/wexts" target="_blank" onClick={() => setOpen(false)}>
                                GitHub
                            </Link>
                            <Link className="btn-primary justify-center" href="/docs/getting-started" onClick={() => setOpen(false)}>
                                Start
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
