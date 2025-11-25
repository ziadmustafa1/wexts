import Link from 'next/link';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
    mounted: boolean;
}

export function HeroSection({ mounted }: HeroSectionProps) {
    return (
        <section className="relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-24">
                {/* Badge */}
                <div className={`flex justify-center mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium">Introducing wexts v2.0</span>
                    </div>
                </div>

                {/* Main Headline */}
                <h1 className={`text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <span className="block bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                        The Full-Stack
                    </span>
                    <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                        TypeScript Framework
                    </span>
                </h1>

                {/* Subtitle */}
                <p className={`text-center text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    Build production-ready applications with Next.js 16 and NestJS 10.
                    <br className="hidden sm:block" />
                    Type-safe from database to UI. Zero configuration.
                </p>

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <Button asChild size="lg" className="h-12 px-8 bg-white text-black hover:bg-gray-200 text-base font-semibold">
                        <Link href="/docs/getting-started">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-12 px-8 border-white/10 hover:bg-white/5 text-base font-semibold">
                        <Link href="/docs">
                            Documentation
                        </Link>
                    </Button>
                </div>

                {/* Code Example */}
                <div className={`max-w-2xl mx-auto transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
                        {/* Terminal Header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <Terminal className="w-4 h-4 text-gray-500 ml-2" />
                            <span className="text-xs text-gray-500 font-mono">~/my-app</span>
                        </div>

                        {/* Code */}
                        <div className="p-6">
                            <code className="font-mono text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-600 select-none">$</span>
                                    <span className="text-gray-300">npx wexts my-app</span>
                                </div>
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
