import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { generateFrameworkResponse } from '../services/geminiService';
import { Bot, Send, User, Loader2 } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I am the wexts Architect. Ask me about the framework's architecture, auto-linking, or how to configure a new module.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateFrameworkResponse(input, messages);

    const botMsg: Message = { role: 'model', content: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-none">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'model' ? 'bg-violet-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
              {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'model'
                ? 'bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                : 'bg-violet-600 text-white'
              }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-violet-600 dark:text-violet-400" />
              <span className="text-zinc-500 text-xs">Consulting blueprint...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-zinc-50 dark:bg-[#0e0e11] border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <input
          className="flex-1 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors"
          placeholder="Ask about wexts architecture..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;