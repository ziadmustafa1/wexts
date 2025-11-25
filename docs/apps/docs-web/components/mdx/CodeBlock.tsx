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
        <div className="my-6 rounded-lg overflow-hidden border border-border bg-zinc-950 dark:bg-zinc-900 shadow-lg">
            {/* Header with filename and language badge */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    {filename && (
                        <span className="text-sm font-medium text-zinc-300">
                            {filename}
                        </span>
                    )}
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-primary/10 text-primary border border-primary/20">
                        {language}
                    </span>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md
                             bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100
                             transition-all duration-200 border border-zinc-700 hover:border-zinc-600"
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

            {/* Code Content */}
            <div className="relative">
                <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                    <code className="font-mono text-zinc-100">
                        {showLineNumbers ? (
                            <div className="table">
                                {children.split('\n').map((line, i) => (
                                    <div key={i} className="table-row">
                                        <span className="table-cell pr-3 text-right select-none text-zinc-600 font-medium">
                                            {i + 1}
                                        </span>
                                        <span className="table-cell pl-3 border-l border-zinc-800">
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
