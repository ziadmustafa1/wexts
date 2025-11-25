const techStack = {
    frontend: [
        { name: 'Next.js 16', description: 'React framework with App Router', icon: '⚡' },
        { name: 'React 19', description: 'Latest React with Server Components', icon: '⚛️' },
        { name: 'Tailwind CSS v4', description: 'Utility-first CSS framework', icon: '🎨' },
        { name: 'TypeScript', description: 'Type-safe JavaScript', icon: '📘' }
    ],
    backend: [
        { name: 'NestJS 10', description: 'Progressive Node.js framework', icon: '🐱' },
        { name: 'Prisma 5', description: 'Next-generation ORM', icon: '🔷' },
        { name: 'Class Validator', description: 'Decorator-based validation', icon: '✅' },
        { name: 'Express/Fastify', description: 'HTTP server (your choice)', icon: '🚀' }
    ],
    tooling: [
        { name: 'TurboRepo', description: 'High-performance build system', icon: '⚙️' },
        { name: 'PNPM', description: 'Fast package manager', icon: '📦' },
        { name: 'ESLint & Prettier', description: 'Code quality and formatting', icon: '✨' },
        { name: 'Vitest', description: 'Blazing fast unit testing', icon: '🧪' }
    ]
};

export function TechStackSection() {
    return (
        <section className="relative py-24 sm:py-32 backdrop-blur-sm bg-white/[0.01]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            Modern tech stack
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Built on the latest and greatest tools in the ecosystem
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {/* Frontend */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                            <h3 className="text-2xl font-bold text-white">Frontend</h3>
                        </div>
                        <div className="space-y-3">
                            {techStack.frontend.map((tech, idx) => (
                                <div key={idx} className="group relative p-5 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-blue-400/30 hover:from-white/[0.12] transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                    <div className="relative flex items-start gap-3">
                                        <span className="text-2xl">{tech.icon}</span>
                                        <div>
                                            <div className="font-semibold text-white mb-1">{tech.name}</div>
                                            <div className="text-sm text-gray-500">{tech.description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
                            <h3 className="text-2xl font-bold text-white">Backend</h3>
                        </div>
                        <div className="space-y-3">
                            {techStack.backend.map((tech, idx) => (
                                <div key={idx} className="group relative p-5 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-green-400/30 hover:from-white/[0.12] transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                    <div className="relative flex items-start gap-3">
                                        <span className="text-2xl">{tech.icon}</span>
                                        <div>
                                            <div className="font-semibold text-white mb-1">{tech.name}</div>
                                            <div className="text-sm text-gray-500">{tech.description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tooling */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-violet-400 to-purple-400 rounded-full" />
                            <h3 className="text-2xl font-bold text-white">Tooling</h3>
                        </div>
                        <div className="space-y-3">
                            {techStack.tooling.map((tech, idx) => (
                                <div key={idx} className="group relative p-5 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-violet-400/30 hover:from-white/[0.12] transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                    <div className="relative flex items-start gap-3">
                                        <span className="text-2xl">{tech.icon}</span>
                                        <div>
                                            <div className="font-semibold text-white mb-1">{tech.name}</div>
                                            <div className="text-sm text-gray-500">{tech.description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
