'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X, Github, Hexagon, Search } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isDocsPage = pathname?.startsWith('/docs');

    const navItems = [
        { href: '/docs', label: 'Documentation' },
        { href: '/docs/getting-started', label: 'Quick Start' },
        { href: '/docs/examples', label: 'Examples' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <Hexagon className="w-8 h-8 text-primary fill-primary/20 group-hover:rotate-90 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">
                            W
                        </div>
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        wexts<span className="text-primary">Docs</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Search Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex"
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </Button>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>

                    {/* GitHub Link */}
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hidden md:flex"
                    >
                        <a
                            href="https://github.com/ziadmustafa1/wexts"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <Github size={20} />
                        </a>
                    </Button>

                    {/* Get Started Button */}
                    <Button asChild className="hidden md:flex">
                        <Link href="/docs/getting-started">Get Started</Link>
                    </Button>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
                    <div className="px-4 py-4 space-y-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-border">
                            <Button asChild className="w-full">
                                <Link href="/docs/getting-started">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
