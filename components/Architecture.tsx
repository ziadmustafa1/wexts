import React from 'react';
import { FileText, Box, Globe, Server, Layers, Cpu, ArrowRightLeft, Package, Database, Activity, Monitor } from 'lucide-react';

const Architecture: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">The Fusion Monorepo Architecture</h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A unified workspace optimized for <strong>Next.js 16</strong> and <strong>NestJS 10</strong>. 
            Type safety flows from the PostgreSQL database all the way to the React DOM.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Apps Column */}
        <div className="space-y-6 relative">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Monitor size={14}/> Applications & Data
            </h3>
            
            {/* Frontend */}
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl hover:border-blue-500/50 transition-all group relative z-10 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                    <Globe className="w-6 h-6" />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">apps/web</h3>
                    <p className="text-xs text-zinc-500">Next.js 16 (App Router)</p>
                    </div>
                </div>
                <div className="pl-16 text-xs text-zinc-500 font-mono">
                    React 19 + Tailwind 4
                </div>
            </div>

            {/* Connection Line */}
            <div className="h-8 w-0.5 bg-gradient-to-b from-zinc-300 to-zinc-300 dark:from-zinc-700 dark:to-zinc-700 mx-auto"></div>

            {/* Backend */}
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl hover:border-red-500/50 transition-all group relative z-10 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 group-hover:scale-105 transition-transform">
                    <Server className="w-6 h-6" />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">apps/api</h3>
                    <p className="text-xs text-zinc-500">NestJS 10 (Node.js)</p>
                    </div>
                </div>
                <div className="pl-16 text-xs text-zinc-500 font-mono">
                    Use: @Controller()
                </div>
            </div>

            {/* Connection Line */}
            <div className="h-8 w-0.5 bg-gradient-to-b from-zinc-300 to-emerald-600 dark:from-zinc-700 dark:to-emerald-700 mx-auto"></div>

             {/* Database */}
             <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl hover:border-emerald-500/50 transition-all group shadow-sm dark:shadow-none">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Database className="w-6 h-6" />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Data Layer</h3>
                    <p className="text-xs text-zinc-500">PostgreSQL + Prisma 6</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Shared Packages Column */}
        <div className="lg:col-span-2 space-y-6">
             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Package size={14}/> Shared Packages (The Glue)
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client SDK */}
                <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl border-l-2 border-l-violet-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        <span className="font-bold text-zinc-900 dark:text-zinc-200">packages/api-client</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Auto-generated SDK. Scans NestJS controllers and produces a strongly-typed `api` object for Next.js 16 Client Components.
                    </p>
                </div>

                {/* Types */}
                <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl border-l-2 border-l-yellow-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                        <span className="font-bold text-zinc-900 dark:text-zinc-200">packages/types</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Shared DTOs, Interfaces, and Zod Schemas. Single source of truth for data shapes across frontend and backend.
                    </p>
                </div>

                 {/* UI */}
                 <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl border-l-2 border-l-pink-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                        <span className="font-bold text-zinc-900 dark:text-zinc-200">packages/ui</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Shared React 19 component library. Optimized for Server Components.
                    </p>
                </div>

                {/* Core */}
                <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl border-l-2 border-l-cyan-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                        <span className="font-bold text-zinc-900 dark:text-zinc-200">packages/core</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Shared validation logic, utilities, and formatting helpers.
                    </p>
                </div>
             </div>

             {/* Insight Box */}
             <div className="mt-6 p-6 bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/10 border border-zinc-200 dark:border-zinc-800 rounded-xl relative overflow-hidden shadow-sm dark:shadow-none">
                <div className="flex items-start gap-4 relative z-10">
                    <Activity className="w-10 h-10 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Fusion Insight GUI</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            A built-in control plane (DevTools) that visualizes the connection between all these layers. 
                            See RPC calls, Database rows, and Monorepo status in one dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Architecture;