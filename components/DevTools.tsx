import React, { useState } from 'react';
import { Activity, Database, Server, Wifi, Play, StopCircle, Search, Terminal, RefreshCw } from 'lucide-react';
import { PRISMA_SCHEMA, MOCK_DB_DATA, MOCK_REQUESTS } from '../constants';
import { MockRequest } from '../types';

const DevTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'database' | 'network'>('overview');
  const [serverStatus, setServerStatus] = useState<'running' | 'stopped'>('running');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0e0e11] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-fade-in shadow-sm dark:shadow-none">
      {/* Header */}
      <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Activity className="text-violet-600 dark:text-violet-500" size={20} />
          <span className="font-bold text-zinc-900 dark:text-white">Fusion Insight</span>
          <span className="text-xs px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">Control Plane</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
               <span className="w-2 h-2 rounded-full bg-green-500"></span> Next.js 16
               <span className="w-2 h-2 rounded-full bg-green-500 ml-2"></span> NestJS 10
            </div>
            <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800"></div>
            <button 
                onClick={() => setServerStatus(serverStatus === 'running' ? 'stopped' : 'running')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${
                    serverStatus === 'running' 
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20' 
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20'
                }`}
            >
                {serverStatus === 'running' ? <><Activity size={12} className="animate-pulse"/> System Online</> : <><StopCircle size={12}/> System Offline</>}
            </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-zinc-50/50 dark:bg-zinc-900/30 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="p-3 space-y-1">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${activeTab === 'overview' ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-white border border-violet-200 dark:border-violet-500/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
                <Server size={16} /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('database')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${activeTab === 'database' ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-white border border-violet-200 dark:border-violet-500/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
                <Database size={16} /> Database <span className="ml-auto text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 rounded text-zinc-600 dark:text-zinc-500">Prisma</span>
            </button>
            <button 
                onClick={() => setActiveTab('network')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${activeTab === 'network' ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-white border border-violet-200 dark:border-violet-500/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
                <Wifi size={16} /> RPC Inspector
            </button>
          </div>
          
          <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0e0e11]">
             <div className="text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-wider">Ports & Services</div>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-xs group">
                    <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">apps/web</span>
                    <span className="font-mono text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-500/20">:3000</span>
                </div>
                <div className="flex justify-between items-center text-xs group">
                    <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">apps/api</span>
                    <span className="font-mono text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-500/20">:5050</span>
                </div>
                <div className="flex justify-between items-center text-xs group">
                    <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Postgres</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">:5432</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-[#0e0e11] overflow-auto p-6 relative">
            
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">System Healthy</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md">
                                Fusion proxy is active. Requests to <code className="text-violet-700 dark:text-violet-300">/api/*</code> are being forwarded to NestJS. Database connection pool is stable.
                            </p>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Next.js Logs */}
                        <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 h-[300px]">
                            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-100 dark:bg-[#121214]">
                                <span className="text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-2">
                                    <div className="w-2 h-2 bg-zinc-900 dark:bg-white rounded-full"></div> NEXT.JS (WEB)
                                </span>
                                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">v16.0.0-canary</span>
                            </div>
                            <div className="flex-1 p-3 font-mono text-xs text-zinc-600 dark:text-zinc-500 overflow-y-auto space-y-1">
                                <div className="text-zinc-500 dark:text-zinc-400">[ wait ]  compiling /...</div>
                                <div className="text-green-600 dark:text-green-400">[ ready ] compiled / in 320ms (Turbopack)</div>
                                <div className="text-zinc-500 dark:text-zinc-400">[ info ]  GET / 200 in 80ms (PPR Active)</div>
                                <div className="text-zinc-500 dark:text-zinc-400">[ info ]  GET /_next/static/chunks/main.js 200 in 5ms</div>
                                <div className="text-blue-600 dark:text-blue-400">[ info ]  Rendering Server Component...</div>
                                <div>[ wait ]  compiling /dashboard...</div>
                                <div className="text-green-600 dark:text-green-400">[ ready ] compiled /dashboard in 95ms</div>
                            </div>
                        </div>

                        {/* NestJS Logs */}
                        <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 h-[300px]">
                            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-100 dark:bg-[#121214]">
                                <span className="text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div> NESTJS (API)
                                </span>
                                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">v10.4.1</span>
                            </div>
                            <div className="flex-1 p-3 font-mono text-xs text-zinc-600 dark:text-zinc-500 overflow-y-auto space-y-1">
                                <div className="text-green-600 dark:text-green-400">[Nest] 4231  - LOG [NestFactory] Starting Nest application...</div>
                                <div className="text-green-600 dark:text-green-400">[Nest] 4231  - LOG [InstanceLoader] AppModule dependencies initialized</div>
                                <div className="text-green-600 dark:text-green-400">[Nest] 4231  - LOG [RoutesResolver] UsersController {"{/users}"}:</div>
                                <div className="pl-4 text-zinc-500 dark:text-zinc-600">Mapped {"{/users, GET}"} route</div>
                                <div className="pl-4 text-zinc-500 dark:text-zinc-600">Mapped {"{/users, POST}"} route</div>
                                <div className="text-green-600 dark:text-green-400">[Nest] 4231  - LOG [NestApplication] Nest application successfully started</div>
                                <div className="text-blue-600 dark:text-blue-400">[Nest] 4231  - LOG [FusionProxy] Watch mode active. API Client synced.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'database' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Database size={18} className="text-emerald-600 dark:text-emerald-500"/> Prisma Studio Lite
                            </h3>
                            <p className="text-zinc-500 text-xs">Connected to <code className="text-zinc-400">postgres://localhost:5432/fusion_dev</code></p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white flex items-center gap-2 transition-colors">
                                <RefreshCw size={12}/> Refresh
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-100 dark:hover:bg-emerald-600/20 flex items-center gap-2 transition-colors">
                                <Terminal size={12}/> db push
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                        {/* Schema Viewer */}
                        <div className="col-span-1 bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                            <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">SCHEMA.PRISMA (v6.0)</div>
                            <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#121214]">
                                <pre className="p-4 text-xs font-mono text-blue-700 dark:text-blue-200 leading-relaxed">
                                    {PRISMA_SCHEMA}
                                </pre>
                            </div>
                        </div>

                        {/* Data Viewer */}
                        <div className="col-span-2 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                            <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">TABLE: USER</span>
                                    <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-500">3 records</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">+ Add Record</button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto custom-scrollbar relative">
                                <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                                    <thead className="bg-zinc-50 dark:bg-[#0e0e11] text-zinc-500 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 font-medium border-b border-zinc-200 dark:border-zinc-800">id</th>
                                            <th className="p-3 font-medium border-b border-zinc-200 dark:border-zinc-800">email</th>
                                            <th className="p-3 font-medium border-b border-zinc-200 dark:border-zinc-800">name</th>
                                            <th className="p-3 font-medium border-b border-zinc-200 dark:border-zinc-800">_count.posts</th>
                                            <th className="p-3 font-medium border-b border-zinc-200 dark:border-zinc-800">actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                                        {MOCK_DB_DATA.map(row => (
                                            <tr key={row.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="p-3 font-mono text-zinc-500">{row.id}</td>
                                                <td className="p-3 text-violet-600 dark:text-violet-300">{row.email}</td>
                                                <td className="p-3">{row.name}</td>
                                                <td className="p-3 text-zinc-500">{row.posts}</td>
                                                <td className="p-3">
                                                    <button className="text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors">Del</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'network' && (
                <div className="space-y-4 animate-fade-in">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Wifi size={18} className="text-blue-500 dark:text-blue-400"/> RPC Inspector
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-2 top-1.5 text-zinc-500 dark:text-zinc-600 w-3.5 h-3.5" />
                            <input className="pl-8 pr-4 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full focus:outline-none focus:border-violet-500 text-zinc-900 dark:text-zinc-300 w-64 placeholder:text-zinc-500 dark:placeholder:text-zinc-600" placeholder="Filter by endpoint..." />
                        </div>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-[#121214]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium text-[10px] uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Method</th>
                                    <th className="px-4 py-3">Endpoint / SDK Function</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3 text-right">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                                {MOCK_REQUESTS.map((req: MockRequest) => (
                                    <tr key={req.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 group cursor-pointer transition-colors">
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${req.status >= 400 ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">{req.method}</td>
                                        <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300 text-xs group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                                            {req.endpoint}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] border px-1.5 py-0.5 rounded ${req.type === 'RPC' ? 'border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'}`}>
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-xs text-zinc-500">{req.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-center text-[10px] text-zinc-500 dark:text-zinc-600 mt-4">
                        Real-time capture active. Logs are streamed from the fusion dev proxy.
                    </p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default DevTools;