import React, { useState, useEffect } from 'react';
import { DEFAULT_NEST_CONTROLLER } from '../constants';
import { simulateCodegen } from '../utils/mockAst';
import { ArrowRight, RefreshCw } from 'lucide-react';

const GeneratorDemo: React.FC = () => {
  const [inputCode, setInputCode] = useState(DEFAULT_NEST_CONTROLLER);
  const [outputCode, setOutputCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  useEffect(() => {
    setIsCompiling(true);
    const timer = setTimeout(() => {
      setOutputCode(simulateCodegen(inputCode));
      setIsCompiling(false);
    }, 600); // Fake latency for realism
    return () => clearTimeout(timer);
  }, [inputCode]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Auto-Linking Engine</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Edit the NestJS Controller on the left. Watch the Client SDK regenerate instantly.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
          <div className={`w-2 h-2 rounded-full ${isCompiling ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          {isCompiling ? 'Parsing AST...' : 'Synced'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-[#0e0e11]">
          <div className="bg-zinc-100 dark:bg-[#18181b] px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">apps/api/src/todos/todos.controller.ts</span>
            <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">NestJS</span>
          </div>
          <textarea
            className="flex-1 bg-white dark:bg-[#0e0e11] text-zinc-800 dark:text-zinc-300 p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Arrow for Desktop */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-zinc-900 p-2 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-xl">
          <ArrowRight className="w-5 h-5 text-violet-600 dark:text-violet-500" />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-[#0e0e11]">
          <div className="bg-zinc-100 dark:bg-[#18181b] px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">packages/api-client/generated.ts</span>
            <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Fusion SDK</span>
          </div>
          <div className="relative flex-1 bg-white dark:bg-[#0e0e11]">
            <pre className="absolute inset-0 p-4 text-sm font-mono text-blue-700 dark:text-blue-100 leading-relaxed overflow-auto">
              {outputCode}
            </pre>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-800 dark:text-violet-200 text-sm">
        <strong>Core Concept:</strong> wexts parses your backend code (AST) to understand your routes and DTOs. It creates a statically typed client wrapper, so you never write <code className="bg-white dark:bg-black/30 px-1 py-0.5 rounded">fetch('/api/todos')</code> manually.
      </div>
    </div>
  );
};

export default GeneratorDemo;