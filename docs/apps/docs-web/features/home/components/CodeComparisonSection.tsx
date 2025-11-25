import { Check } from 'lucide-react';

export function CodeComparisonSection() {
    return (
        <section className="relative py-24 sm:py-32 border-y border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            See it in action
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Write your controller, use it in your component. That's it.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
                    {/* Backend */}
                    <div className="group relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                        <div className="relative">
                            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-white/[0.03]">
                                <span className="text-sm font-mono text-gray-300">users.controller.ts</span>
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                                    NestJS
                                </span>
                            </div>
                            <div className="p-8">
                                <pre className="text-sm font-mono leading-relaxed">
                                    <code>
                                        <span className="text-purple-400">@Injectable</span>()<br />
                                        <span className="text-blue-400">export class</span> <span className="text-yellow-400">UsersService</span> {'{'}< br />
                                        &nbsp;&nbsp;<span className="text-purple-400">@RPC</span>() <span className="text-gray-500">// ✨ Magic!</span><br />
                                        &nbsp;&nbsp;<span className="text-blue-400">async</span> <span className="text-yellow-400">getUser</span>(<span className="text-orange-400">id</span>: <span className="text-green-400">string</span>) {'{'}<br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">return this</span>.prisma.user<br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.findUnique({'{'} <span className="text-orange-400">where</span>: {'{'} id {'}'} {'}'});<br />
                                        &nbsp;&nbsp;{'}'}<br />
                                        {'}'}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Frontend */}
                    <div className="group relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                        <div className="relative">
                            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-white/[0.03]">
                                <span className="text-sm font-mono text-gray-300">users.tsx</span>
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                                    Next.js
                                </span>
                            </div>
                            <div className="p-8">
                                <pre className="text-sm font-mono leading-relaxed">
                                    <code>
                                        <span className="text-blue-400">import</span> {'{'} rpc {'}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@wexts/sdk'</span>;<br />
                                        <br />
                                        <span className="text-blue-400">export default function</span> <span className="text-yellow-400">UsersPage</span>() {'{'}<br />
                                        &nbsp;&nbsp;<span className="text-blue-400">const</span> user = <span className="text-blue-400">await</span> rpc.users<br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;.<span className="text-yellow-400">getUser</span>(<span className="text-green-400">'123'</span>);<br />
                                        <br />
                                        &nbsp;&nbsp;<span className="text-gray-500">// Full type safety! 🎉</span><br />
                                        &nbsp;&nbsp;<span className="text-blue-400">return</span> &lt;div&gt;{'{'}user.name{'}'}&lt;/div&gt;;<br />
                                        {'}'}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    {['No API routes', 'No fetch calls', 'Full autocomplete', 'Type-safe end-to-end'].map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/[0.05] border border-white/10">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
