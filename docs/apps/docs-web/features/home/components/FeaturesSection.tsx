import { Check, Zap, Code2, Database, Globe, Sparkles } from 'lucide-react';

const features = [
    {
        icon: Zap,
        gradient: 'from-violet-500 to-purple-500',
        title: 'RPC Out of the Box',
        description: 'Call backend functions from frontend with full type safety. No API routes, no fetch calls.'
    },
    {
        icon: Code2,
        gradient: 'from-blue-500 to-cyan-500',
        title: 'Full Type Safety',
        description: 'End-to-end TypeScript from database to UI. Catch errors at compile time, not runtime.'
    },
    {
        icon: Database,
        gradient: 'from-green-500 to-emerald-500',
        title: 'Prisma Integration',
        description: 'Built-in Prisma ORM with automatic migrations and type-safe database queries.'
    },
    {
        icon: Globe,
        gradient: 'from-orange-500 to-amber-500',
        title: 'Monorepo Ready',
        description: 'TurboRepo-powered monorepo with shared types and packages across your entire stack.'
    },
    {
        icon: Sparkles,
        gradient: 'from-pink-500 to-rose-500',
        title: 'Modern Stack',
        description: 'Next.js 16, React 19, NestJS 10, and Tailwind CSS v4. Always up to date.'
    },
    {
        icon: Check,
        gradient: 'from-cyan-500 to-teal-500',
        title: 'Zero Config',
        description: 'Start coding immediately. No complex setup, no configuration hell.'
    }
];

export function FeaturesSection() {
    return (
        <section className="relative py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            Built for production
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Everything you need to ship modern applications, in one framework
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative rounded-2xl p-8 backdrop-blur-sm bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1"
                            style={{
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl"
                                style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                            />

                            <div className="relative">
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
