import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'wexts Documentation - Next.js + NestJS Framework',
    description: 'Complete documentation for wexts - the full-stack framework for perfectionists. Zero API boilerplate, type-safe from database to client.',
    keywords: ['wexts', 'Next.js', 'NestJS', 'TypeScript', 'Full-stack', 'Framework', 'RPC'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider defaultTheme="dark">
                    <Navbar />
                    <main className="pt-16">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
