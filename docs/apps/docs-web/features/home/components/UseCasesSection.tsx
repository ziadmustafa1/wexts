import { Briefcase, ShoppingCart, MessageSquare, BarChart } from 'lucide-react';

const useCases = [
    {
        icon: ShoppingCart,
        gradient: 'from-orange-500 to-amber-500',
        title: 'E-commerce Platforms',
        description: 'Build scalable online stores with real-time inventory, payment processing, and order management.',
        features: ['Product catalog', 'Cart & checkout', 'Payment integration', 'Order tracking']
    },
    {
        icon: Briefcase,
        gradient: 'from-blue-500 to-cyan-500',
        title: 'SaaS Applications',
        description: 'Create multi-tenant applications with authentication, subscriptions, and team collaboration.',
        features: ['User management', 'Billing & subscriptions', 'Team workspaces', 'Analytics dashboard']
    },
    {
        icon: MessageSquare,
        gradient: 'from-green-500 to-emerald-500',
        title: 'Social Platforms',
        description: 'Develop social networks with real-time messaging, feeds, and user interactions.',
        features: ['Real-time chat', 'Activity feeds', 'Notifications', 'Media uploads']
    },
    {
        icon: BarChart,
        gradient: 'from-violet-500 to-purple-500',
        title: 'Admin Dashboards',
        description: 'Build powerful internal tools with data visualization, reporting, and management features.',
        features: ['Data tables', 'Charts & graphs', 'CRUD operations', 'Export functionality']
    }
];

export function UseCasesSection() {
    return (
        <section className="relative py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            Perfect for any use case
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        From MVPs to enterprise applications, wexts scales with your needs
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {useCases.map((useCase, idx) => (
                        <div
                            key={idx}
                            className="group relative rounded-2xl p-8 backdrop-blur-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Hover Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity rounded-2xl`} />

                            <div className="relative">
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${useCase.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <useCase.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{useCase.title}</h3>
                                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                    {useCase.description}
                                </p>
                                <ul className="space-y-2">
                                    {useCase.features.map((feature, i) => (
                                        <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${useCase.gradient}`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
