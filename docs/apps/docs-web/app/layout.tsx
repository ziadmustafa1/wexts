import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const archivo = Archivo({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const plexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Wexts Documentation - Next.js + NestJS Toolkit',
    description: 'Current Wexts 4 documentation for generated RPC, the single production runtime, Vercel Build Output support, and Wexts Shield.',
    keywords: ['wexts', 'Next.js', 'NestJS', 'TypeScript', 'Full-stack', 'Framework', 'RPC'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${archivo.variable} ${plexMono.variable}`}>
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
