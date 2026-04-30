'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
    children: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
}

export function CodeBlock({ children, language = 'typescript', filename, showLineNumbers = false }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/20">
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/40 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                    {filename && (
                        <span className="truncate text-sm font-medium text-slate-300">
                            {filename}
                        </span>
                    )}
                    <span className="shrink-0 rounded border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-xs font-semibold text-amber-100">
                        {language}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <Check size={12} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={12} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            <div className="relative max-w-full overflow-hidden">
                <pre className="max-w-full overflow-x-auto p-4 text-sm leading-relaxed">
                    <code className="font-mono text-slate-100">
                        {showLineNumbers ? (
                            <div className="table min-w-max">
                                {children.split('\n').map((line, i) => (
                                    <div key={i} className="table-row">
                                        <span className="table-cell select-none pr-3 text-right font-medium text-slate-600">
                                            {i + 1}
                                        </span>
                                        <span className="table-cell border-l border-slate-800 pl-3">
                                            {line}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            children
                        )}
                    </code>
                </pre>
            </div>
        </div>
    );
}
