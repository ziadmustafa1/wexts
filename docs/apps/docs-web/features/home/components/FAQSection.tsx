'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: 'What is wexts?',
        answer: 'wexts is a full-stack TypeScript framework that combines Next.js 16 and NestJS 10 in a monorepo. It provides automatic RPC generation, end-to-end type safety, and zero configuration setup.'
    },
    {
        question: 'How is it different from tRPC or GraphQL?',
        answer: 'Unlike tRPC which requires manual router setup, wexts automatically generates your API from NestJS decorators. Compared to GraphQL, there\'s no schema definition needed - your TypeScript types ARE the schema.'
    },
    {
        question: 'Can I use it with existing projects?',
        answer: 'Yes! You can integrate wexts into existing Next.js or NestJS projects. The framework is designed to be incremental - start with one RPC endpoint and gradually migrate more functionality.'
    },
    {
        question: 'What databases are supported?',
        answer: 'wexts uses Prisma ORM, which supports PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB. You can use any database that Prisma supports.'
    },
    {
        question: 'Is it production-ready?',
        answer: 'Yes! wexts v2.0 is stable and battle-tested in production. It includes built-in error handling, validation, logging, and monitoring features required for production applications.'
    },
    {
        question: 'How do I deploy wexts applications?',
        answer: 'Deploy the Next.js frontend to Vercel/Netlify and the NestJS backend to any Node.js hosting (Render, Railway, AWS, etc.). The monorepo structure makes it easy to deploy both apps together or separately.'
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="relative py-24 sm:py-32 border-t border-white/10">
            {/* Subtle Background Accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent" />

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            Frequently asked questions
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Everything you need to know about wexts
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="group rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
                            >
                                <span className="font-semibold text-lg pr-4 text-white">{faq.question}</span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 ${openIndex === idx ? 'rotate-180 bg-violet-500/20' : 'group-hover:bg-white/10'}`}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
