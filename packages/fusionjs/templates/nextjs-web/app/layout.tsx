import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FusionProvider } from 'wexts/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Fusion App',
    description: 'Built with wexts',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <FusionProvider baseUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}>
                    {children}
                </FusionProvider>
            </body>
        </html>
    );
}
