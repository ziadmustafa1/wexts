import { Sidebar } from '@/components/Sidebar';
import { TableOfContents } from '@/components/TableOfContents';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full">
            {/* Sidebar - Fixed width with better spacing */}
            <Sidebar />

            {/* Main Content - Balanced padding */}
            <main className="flex-1 min-w-0">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-12">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                        {/* Article Content */}
                        <article className="flex-1 min-w-0 max-w-4xl">
                            {children}
                        </article>

                        {/* Table of Contents - Hidden on mobile */}
                        <aside className="hidden xl:block w-64 flex-shrink-0">
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
