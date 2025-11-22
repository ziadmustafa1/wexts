import React, { useState, useEffect, useRef } from 'react';
import { CliLine } from '../types';
import { FUSION_CLI_ASCII } from '../constants';

const TerminalDemo: React.FC = () => {
  const [lines, setLines] = useState<CliLine[]>([
    { type: 'info', text: FUSION_CLI_ASCII },
    { type: 'info', text: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();

    let newLines: CliLine[] = [{ type: 'input', text: `> ${cmd}` }];

    switch (command) {
      case 'help':
        newLines.push({
          type: 'info',
          text: `
Available Commands:
  fusion new module <name>      Scaffold a full-stack module (Next+Nest)
  fusion generate controller    Generate a NestJS controller
  fusion generate service       Generate a NestJS service
  fusion dev                    Start dev environment with Auto-Proxy
  fusion build                  Build monorepo for production
`
        });
        break;
      case 'clear':
        setLines([]);
        return;
      case 'fusion':
        if (args[1] === 'dev') {
          newLines.push({ type: 'info', text: 'Starting wexts Monorepo...' });
          newLines.push({ type: 'info', text: '► apps/web (Next.js) ready on http://localhost:3000' });
          newLines.push({ type: 'info', text: '► apps/api (NestJS) ready on port 5050' });
          newLines.push({ type: 'success', text: '✔ Proxy established: localhost:3000/api/* -> localhost:5050' });
          newLines.push({ type: 'success', text: '✔ API Client regenerated from apps/api' });
          newLines.push({ type: 'info', text: 'Watching for changes...' });
        } else if (args[1] === 'new' && args[2] === 'module') {
          const moduleName = args[3] || 'resource';
          newLines.push({ type: 'info', text: `Scaffolding module: ${moduleName}...` });
          newLines.push({ type: 'success', text: `✔ Created apps/api/src/${moduleName}/${moduleName}.controller.ts` });
          newLines.push({ type: 'success', text: `✔ Created apps/api/src/${moduleName}/${moduleName}.service.ts` });
          newLines.push({ type: 'success', text: `✔ Created apps/web/app/${moduleName}/page.tsx` });
          newLines.push({ type: 'success', text: `✔ Updated packages/types/src/index.ts` });
        } else if (args[1] === 'generate' && args[2] === 'controller') {
          const name = args[3] || 'example';
          newLines.push({ type: 'success', text: `✔ Generated apps/api/src/${name}/${name}.controller.ts` });
          newLines.push({ type: 'info', text: `✔ Re-generating API Client... Done.` });
        } else if (args[1] === 'build') {
          newLines.push({ type: 'info', text: 'Building wexts Monorepo...' });
          newLines.push({ type: 'info', text: '► packages/types built' });
          newLines.push({ type: 'info', text: '► packages/api-client generated & built' });
          newLines.push({ type: 'info', text: '► apps/api (NestJS) built' });
          newLines.push({ type: 'info', text: '► apps/web (Next.js) built' });
          newLines.push({ type: 'success', text: '✔ Build complete.' });
        } else {
          newLines.push({ type: 'info', text: 'Usage: fusion <command>' });
        }
        break;
      default:
        newLines.push({ type: 'error', text: `Command not found: ${command}` });
    }

    setLines(prev => [...prev, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-[#0e0e11] rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl h-[600px] flex flex-col font-mono text-sm overflow-hidden transition-colors">
      <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <span className="ml-2 text-zinc-500 dark:text-zinc-400 text-xs">fusion-cli — bash — 80x24</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto text-zinc-700 dark:text-zinc-300">
        {lines.map((line, i) => (
          <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-red-600 dark:text-red-400' :
              line.type === 'success' ? 'text-green-600 dark:text-green-400' :
                line.type === 'input' ? 'text-zinc-500 dark:text-zinc-500' : 'text-zinc-700 dark:text-zinc-300'
            }`}>
            <pre className="whitespace-pre-wrap font-mono">{line.text}</pre>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-white dark:bg-[#121214] border-t border-zinc-200 dark:border-zinc-800 flex items-center">
        <span className="text-violet-600 dark:text-violet-500 mr-2">➜</span>
        <span className="text-blue-600 dark:text-blue-400 mr-2">~/fusion-app</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-100 flex-1"
          placeholder="Type 'help'..."
          autoFocus
        />
      </div>
    </div>
  );
};

export default TerminalDemo;