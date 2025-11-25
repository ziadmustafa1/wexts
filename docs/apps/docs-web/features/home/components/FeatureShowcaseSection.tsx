import { Zap, Shield, Layers, Eye } from 'lucide-react';

const showcaseFeatures = [
    {
        icon: Zap,
        color: 'violet',
        title: 'Automatic RPC Generation',
        description: 'Just add @RPC() decorator to any NestJS method and instantly call it from your Next.js frontend with full type safety.',
        code: `// Backend
@RPC()
async createPost(data: CreatePostDto) {
  return this.postsService.create(data);
}

// Frontend - Automatically generated!
const post = await rpc.posts.createPost({
  title: "Hello World",
  content: "This just works!"
});`
    },
    {
        icon: Shield,
        color: 'blue',
        title: 'Built-in Validation & Security',
        description: 'Automatic request validation, error handling, and security middleware. No manual setup required.',
        code: `// DTOs are automatically validated
class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  content: string;
}

// Type errors & runtime validation
// happen automatically`
    },
    {
        icon: Layers,
        color: 'green',
        title: 'Monorepo Architecture',
        description: 'Shared types, DTOs, and utilities across your entire stack. Change once, update everywhere.',
        code: `// packages/shared/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// Used in both apps automatically!
// No manual type syncing needed`
    },
    {
        icon: Eye,
        color: 'fuchsia',
        title: 'Insight GUI Dashboard',
        description: 'Visual control panel to monitor RPC calls, manage database with Prisma GUI, view logs, and debug in real-time.',
        code: `// Access at http://localhost:3001
- 📊 Real-time RPC monitoring
- 🗄️ Prisma Studio integration
- 📝 Service logs viewer
- 🔍 Request/Response inspector
- ⚡ Performance metrics`
    }
];

export function FeatureShowcaseSection() {
    return (
        <section className="relative py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            Deep dive into features
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Explore how wexts makes full-stack development effortless
                    </p>
                </div>

                <div className="max-w-6xl mx-auto space-y-16">
                    {showcaseFeatures.map((feature, idx) => (
                        <div key={idx} className={`grid md:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                            <div className={idx % 2 === 1 ? 'md:col-start-2' : ''}>
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/5 border border-${feature.color}-500/20 mb-6`}>
                                    <feature.icon className={`w-8 h-8 text-${feature.color}-400`} />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-lg text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                            <div className={idx % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                                <div className="group relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                                    {/* Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />

                                    <div className="relative p-6">
                                        <pre className="text-sm font-mono leading-relaxed text-gray-300 overflow-x-auto">
                                            <code>{feature.code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
