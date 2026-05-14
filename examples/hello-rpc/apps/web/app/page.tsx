'use client';

import { useAuth } from '@/lib/wexts-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Shield, Zap, Terminal, Code2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
            </div>

            {/* Navbar */}
            <header className="w-full border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Wexts</span>
                    </div>
                    <nav className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <Button variant="default" onClick={() => router.push('/dashboard')}>
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="default">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        Production-ready Fullstack Toolkit
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        The Ultimate <br className="hidden md:block" />
                        <span className="text-gradient">Next.js + NestJS</span> Bridge
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Wexts brings together the power of Next.js and NestJS into a seamless, type-safe, single-runtime experience. Build faster, scale better, and never worry about RPC generation again.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {isAuthenticated ? (
                            <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20" onClick={() => router.push('/dashboard')}>
                                Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        ) : (
                            <Link href="/register">
                                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                                    Start Building <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                        <a href="https://github.com/wexts" target="_blank" rel="noreferrer">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border bg-background/50 backdrop-blur-md hover:bg-accent/50">
                                <Terminal className="mr-2 w-5 h-5" /> Documentation
                            </Button>
                        </a>
                    </div>
                </motion.div>

                {/* Features Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto w-full px-4"
                >
                    <div className="glass p-6 rounded-2xl flex flex-col items-start dark:glass-dark transition-transform hover:-translate-y-1 duration-300">
                        <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Typed RPC Bridge</h3>
                        <p className="text-muted-foreground">Deterministic codegen that keeps your frontend and backend in perfect sync. No more broken API contracts.</p>
                    </div>

                    <div className="glass p-6 rounded-2xl flex flex-col items-start dark:glass-dark transition-transform hover:-translate-y-1 duration-300">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Single Runtime</h3>
                        <p className="text-muted-foreground">Run Next.js, NestJS, and Fastify in one process. Radically simple deployments without complex microservices.</p>
                    </div>

                    <div className="glass p-6 rounded-2xl flex flex-col items-start dark:glass-dark transition-transform hover:-translate-y-1 duration-300">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Strict Security</h3>
                        <p className="text-muted-foreground">Built-in DDoS protection, strict request parsing, and rate-limiting designed for production from day one.</p>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-border/40 mt-auto">
                <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    <p>© {new Date().getFullYear()} Wexts. Built with precision for production environments.</p>
                </div>
            </footer>
        </div>
    );
}
