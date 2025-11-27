import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WextsProvider } from '@/lib/wexts-client';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'wexts Web App',
    description: 'Modern web application built with wexts',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <WextsProvider baseUrl="/api">
                    {children}
                    <Toaster position="top-center" />
                </WextsProvider>
            </body>
        </html>
    );
}
