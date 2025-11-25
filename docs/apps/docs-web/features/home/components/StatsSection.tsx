export function StatsSection() {
    const stats = [
        { value: '100%', label: 'Type Safe', description: 'End-to-end TypeScript', gradient: 'from-violet-400 to-purple-400' },
        { value: '0ms', label: 'Cold Start', description: 'Instant RPC calls', gradient: 'from-blue-400 to-cyan-400' },
        { value: '< 1KB', label: 'Runtime', description: 'Minimal overhead', gradient: 'from-green-400 to-emerald-400' },
        { value: '10x', label: 'Faster', description: 'Than REST APIs', gradient: 'from-fuchsia-400 to-pink-400' }
    ];

    return (
        <section className="relative py-20 border-y border-white/10 backdrop-blur-sm bg-white/[0.02]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="group text-center relative">
                            {/* Hover Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                            <div className="relative">
                                <div className={`text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                    {stat.value}
                                </div>
                                <div className="text-lg font-bold text-white mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {stat.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
