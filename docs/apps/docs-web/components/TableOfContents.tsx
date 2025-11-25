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
        <aside className="hidden xl:block w-64 border-l border-border">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
                <h4 className="font-semibold mb-4 text-sm">On this page</h4>
                <nav className="space-y-1">
                    {headings.map((heading, index) => (
                        <a
                            key={heading.id || `heading-${index}`}
                            href={`#${heading.id}`}
                            className={cn(
                                "block text-sm transition-all py-1.5",
                                "hover:text-primary",
                                heading.level === 3 && "pl-4",
                                activeId === heading.id
                                    ? "text-primary font-medium border-l-2 border-primary pl-3"
                                    : "text-muted-foreground"
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
        </aside>
    );
}
