import React from 'react';
import { FUSION_CONFIG_EXAMPLE, FUSION_FILE_TREE, SDK_PACKAGE_JSON, SDK_TSUP_CONFIG, SDK_FETCHER_TS } from '../constants';
import { FileCode, Terminal, Share2, Zap, Package, Upload } from 'lucide-react';

const Docs: React.FC = () => {
  const CodeBlock = ({ title, code, lang = 'typescript' }: { title: string, code: string, lang?: string }) => (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0e0e11] overflow-hidden flex flex-col">
      <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{title}</span>
        <span className="text-[10px] uppercase text-zinc-400">{lang}</span>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-zinc-700 dark:text-zinc-300">{code}</pre>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      <div className="space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">wexts Framework Specification</h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            The definitive guide to the unified <strong>Next.js 16</strong> + <strong>NestJS 10</strong> monorepo architecture.
            Combining backend power with frontend speed.
          </p>
        </div>

        {/* Core Concept Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Automatic Backend Linking</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              No more <code className="bg-zinc-100 dark:bg-black/40 px-1 rounded">fetch('/api/users')</code>.
              wexts parses your NestJS controllers and generates a type-safe SDK.
              Frontend calls <code className="text-violet-700 dark:text-violet-300">api.users.findAll()</code> directly from Server Actions or Client Components.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <Share2 size={20} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Full Shared Types</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              DTOs, Enums, and Validation Schemas live in <code className="bg-zinc-100 dark:bg-black/40 px-1 rounded">packages/types</code>.
              Changes in the backend immediately break the frontend build if they don't match.
            </p>
          </div>
        </div>

        {/* Folder Structure */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-l-4 border-violet-600 dark:border-violet-500 pl-4">Monorepo Structure</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Optimized for TurboRepo. Uses <strong>React 19 (RC)</strong> and <strong>NestJS 10</strong> by default.
          </p>
          <div className="bg-zinc-50 dark:bg-[#0e0e11] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
            <pre className="text-sm font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">{FUSION_FILE_TREE}</pre>
          </div>
        </section>

        {/* SDK Boilerplate Section - NEW */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-l-4 border-violet-600 dark:border-violet-500 pl-4 flex items-center gap-3">
            SDK Publishing Guide
            <span className="text-xs font-normal bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full border border-violet-200 dark:border-violet-500/30">For Package Authors</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            To publish <code className="text-violet-600 dark:text-violet-400">@wexts/sdk</code> to npm, use the following boilerplate for the <code className="text-zinc-800 dark:text-zinc-200">packages/api-client</code> directory.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <CodeBlock title="packages/api-client/package.json" code={SDK_PACKAGE_JSON} lang="json" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeBlock title="packages/api-client/tsup.config.ts" code={SDK_TSUP_CONFIG} />
              <CodeBlock title="packages/api-client/src/fetcher.ts" code={SDK_FETCHER_TS} />
            </div>
          </div>

          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Upload className="text-zinc-500" size={20} />
              <span className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">npm publish --access public</span>
            </div>
            <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-80 transition-opacity">
              Copy & Publish
            </button>
          </div>
        </section>

        {/* Configuration */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-l-4 border-violet-600 dark:border-violet-500 pl-4">Global Configuration</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            The <code className="text-violet-700 dark:text-violet-300">fusion.config.ts</code> file controls the monorepo behavior, including the developer proxy that routes traffic from Next.js to NestJS automatically.
          </p>
          <CodeBlock title="fusion.config.ts" code={FUSION_CONFIG_EXAMPLE} />
        </section>

        {/* Dev Experience */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-l-4 border-violet-600 dark:border-violet-500 pl-4">Developer Experience (DX)</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Fusion Insight GUI for visual management",
              "Partial Prerendering (PPR) Support",
              "Hot Reload for both Backend & Frontend",
              "Auto-generated API Client on save",
              "Tailwind v4 (Oxide) Integrated"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900/30 rounded-lg border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-zinc-700 dark:text-zinc-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CLI Reference */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-l-4 border-violet-600 dark:border-violet-500 pl-4">CLI Commands</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th className="p-4 font-medium">Command</th>
                  <th className="p-4 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#0e0e11]">
                <tr>
                  <td className="p-4 font-mono text-violet-600 dark:text-violet-400">fusion new module [name]</td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">Creates Controller, Service, and Next.js Page.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-violet-600 dark:text-violet-400">fusion dev</td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">Starts monorepo in watch mode with Proxy & Insight GUI.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-violet-600 dark:text-violet-400">fusion generate controller</td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">Adds a new NestJS controller and updates SDK.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-violet-600 dark:text-violet-400">fusion build</td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">Compiles API, Web, and Packages for prod.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Docs;