import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/TableOfContents';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full min-w-0 flex-col bg-[#080a0f] text-slate-100 lg:flex-row">
            <Sidebar />
            <main className="flex-1 min-w-0">
                <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:gap-10">
                        <article className="min-w-0 flex-1">
                            {children}
                        </article>
                        <aside className="hidden w-60 shrink-0 xl:block">
                            <div className="sticky top-20 space-y-4">
                                <TableOfContents />
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
