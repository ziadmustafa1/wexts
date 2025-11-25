'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, BookOpen, Zap, Code, Box, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type NavItem = {
    title: string;
    href: string;
    icon?: any;
    items?: NavItem[];
};

const navigation: NavItem[] = [
    {
        title: 'Getting Started',
        href: '/docs/getting-started',
        icon: Zap,
        items: [
            { title: 'Introduction', href: '/docs/getting-started' },
            { title: 'Installation', href: '/docs/getting-started/installation' },
            { title: 'Quick Start', href: '/docs/getting-started/quick-start' },
        ],
    },
    {
        title: 'Features',
        href: '/docs/features',
        icon: Box,
        items: [
            { title: 'Overview', href: '/docs/features' },
            { title: 'RPC Auto-Linking', href: '/docs/features/rpc' },
            { title: 'Fusion Insight', href: '/docs/features/insight' },
            { title: 'Type Safety', href: '/docs/features/type-safety' },
        ],
    },
    {
        title: 'API Reference',
        href: '/docs/api',
        icon: Code,
        items: [
            { title: 'Overview', href: '/docs/api' },
            { title: 'CLI Commands', href: '/docs/api/cli' },
            { title: 'Configuration', href: '/docs/api/config' },
        ],
    },
    {
        title: 'Examples',
        href: '/docs/examples',
        icon: BookOpen,
        items: [
            { title: 'Basic Usage', href: '/docs/examples' },
            { title: 'Authentication', href: '/docs/examples/auth' },
            { title: 'Real-time Features', href: '/docs/examples/realtime' },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<string[]>(['Getting Started', 'Features']);

    const toggleSection = (title: string) => {
        setOpenSections((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    return (
        <aside className="w-64 border-r border-border bg-background/50 backdrop-blur-sm">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
                <nav className="space-y-2">
                    {navigation.map((section) => {
                        const isOpen = openSections.includes(section.title);
                        const Icon = section.icon;

                        return (
                            <div key={section.title}>
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        pathname === section.href && "bg-primary/10 text-primary"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {Icon && <Icon size={16} />}
                                        <span>{section.title}</span>
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className={cn(
                                            "transition-transform duration-200",
                                            isOpen && "rotate-90"
                                        )}
                                    />
                                </button>

                                {isOpen && section.items && (
                                    <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "block px-3 py-1.5 rounded-md text-sm transition-all",
                                                    "hover:bg-accent hover:text-accent-foreground",
                                                    pathname === item.href
                                                        ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
