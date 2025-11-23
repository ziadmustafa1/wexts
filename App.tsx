import React, { useState, useEffect } from 'react';
import { Terminal, Zap, Layers, BookOpen, Bot, Github, Hexagon, Activity, Sun, Moon } from 'lucide-react';
import { View } from './types';
import TerminalDemo from './components/TerminalDemo';
import GeneratorDemo from './components/GeneratorDemo';
import Architecture from './components/Architecture';
import Docs from './components/Docs';
import DevTools from './components/DevTools';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HERO);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        currentView === view 
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' 
          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-200 selection:bg-violet-500/30 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentView(View.HERO)}
          >
            <div className="relative">
                <Hexagon className="w-8 h-8 text-violet-600 dark:text-violet-500 fill-violet-500/20 group-hover:rotate-90 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">F</div>
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">Fusion<span className="text-violet-600 dark:text-violet-500">JS</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            <NavItem view={View.HERO} icon={Zap} label="Overview" />
            <NavItem view={View.CLI} icon={Terminal} label="CLI" />
            <NavItem view={View.GENERATOR} icon={Zap} label="Auto-Linking" />
            <NavItem view={View.DEVTOOLS} icon={Activity} label="Insight GUI" />
            <NavItem view={View.ARCHITECTURE} icon={Layers} label="Architecture" />
            <NavItem view={View.DOCS} icon={BookOpen} label="Docs" />
            <NavItem view={View.AI_ASSISTANT} icon={Bot} label="AI Architect" />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <button className="bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {currentView === View.HERO && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-violet-600 dark:text-violet-400 text-sm mb-8 animate-pulse-slow shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                v2.0 Release (Next.js 16 + NestJS 10)
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-6 max-w-4xl">
                Next.js + NestJS. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-600">
                  Unified at last.
                </span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed">
                The full-stack framework for perfectionists. Zero API boilerplate. 
                Type-safe from database to client. Automatic SDK generation. 
                Monorepo made simple.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCurrentView(View.DEVTOOLS)}
                  className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-violet-500/20 dark:shadow-violet-900/40 flex items-center gap-2"
                >
                  <Activity size={20}/> Open Fusion Insight
                </button>
                <button 
                    onClick={() => setCurrentView(View.CLI)}
                    className="px-8 py-4 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full font-bold text-lg transition-all shadow-sm"
                >
                  Try the CLI
                </button>
              </div>
              
              {/* Feature Grid Mini */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full text-left">
                 <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-violet-500/30 transition-colors shadow-sm dark:shadow-none">
                    <Activity className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Fusion Insight GUI</h3>
                    <p className="text-zinc-600 dark:text-zinc-500">Visual control plane for your stack. Monitor RPC calls, manage Prisma data, and view service logs in one dashboard.</p>
                 </div>
                 <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-yellow-500/30 transition-colors shadow-sm dark:shadow-none">
                    <Zap className="w-8 h-8 text-yellow-500 dark:text-yellow-400 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">React 19 + Next.js 16</h3>
                    <p className="text-zinc-600 dark:text-zinc-500">Built on the latest canary. Leveraging Server Components, Actions, and Partial Prerendering (PPR) by default.</p>
                 </div>
                 <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500/30 transition-colors shadow-sm dark:shadow-none">
                    <Layers className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Monorepo Native</h3>
                    <p className="text-zinc-600 dark:text-zinc-500">Built on TurboRepo. Shared types, DTOs, and UI library (Tailwind v4) out of the box with NestJS 10.</p>
                 </div>
              </div>
            </div>
          )}

          {currentView === View.CLI && (
             <div className="animate-fade-in">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">The Fusion CLI</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Experience the developer flow. Try typing <code className="text-violet-600 dark:text-violet-400">fusion new users</code> or <code className="text-violet-600 dark:text-violet-400">fusion dev</code>.</p>
                </div>
                <TerminalDemo />
             </div>
          )}

          {currentView === View.GENERATOR && (
             <div className="animate-fade-in h-full">
                <GeneratorDemo />
             </div>
          )}

          {currentView === View.DEVTOOLS && (
             <div className="animate-fade-in h-[700px]">
                <DevTools />
             </div>
          )}

          {currentView === View.ARCHITECTURE && <Architecture />}
          
          {currentView === View.DOCS && <Docs />}

        </div>
      </main>
    </div>
  );
};

export default App;