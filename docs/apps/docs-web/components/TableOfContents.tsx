'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Heading = {
    id: string;
    text: string;
    level: number;
};

export function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const article = document.querySelector('.mdx-content');
        if (!article) return;

        const elements = Array.from(article.querySelectorAll('h2, h3'))
            .map((element, index) => ({
                id: element.id || `heading-${index}`,
                text: element.textContent || '',
                level: Number(element.tagName.charAt(1)),
            }))
            .filter((heading) => heading.id && heading.text); // Only include headings with both ID and text

        setHeadings(elements);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        elements.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="border-l border-slate-900 pl-5">
            <div className="max-h-[calc(100vh-6rem)] overflow-y-auto py-2">
                <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-slate-600">On this page</h4>
                <nav className="space-y-1">
                    {headings.map((heading, index) => (
                        <a
                            key={heading.id || `heading-${index}`}
                            href={`#${heading.id}`}
                            className={cn(
                                "block rounded-lg py-1.5 text-sm transition-all",
                                "hover:text-amber-100",
                                heading.level === 3 && "pl-4",
                                activeId === heading.id
                                    ? "text-amber-100"
                                    : "text-slate-500"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                });
                            }}
                        >
                            {heading.text}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
}
