import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
    return (
        <section className="relative py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative max-w-5xl mx-auto">
                    {/* Glow Effects */}
                    <div className="absolute -top-24 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />

                    <div className="relative text-center rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-b from-white/[0.1] to-white/[0.02] border border-white/20 p-12 sm:p-20">
                        {/* Animated Border Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/20 to-violet-600/0 animate-pulse" />

                        <div className="relative">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
                                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                                    Start building today
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join developers building production applications with <span className="text-white font-semibold">wexts</span>
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-14 px-10 bg-white text-black hover:bg-gray-100 text-base font-bold shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all hover:scale-105"
                                >
                                    <Link href="/docs/getting-started">
                                        Get Started
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-10 border-white/20 hover:bg-white/10 backdrop-blur-sm text-base font-bold hover:border-white/30 transition-all"
                                >
                                    <Link href="https://github.com/yourusername/wexts" target="_blank">
                                        <Github className="mr-2 h-5 w-5" />
                                        View on GitHub
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span>Open Source</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                                    <span>MIT Licensed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '1s' }} />
                                    <span>Production Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
