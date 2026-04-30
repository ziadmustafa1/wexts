import { Metadata } from 'next';
import { HomePage } from '@/features/home/HomePage';

export const metadata: Metadata = {
    title: 'Wexts 4 - Next.js + NestJS Toolkit',
    description: 'Production-focused single-runtime toolkit for Next.js and NestJS with generated RPC, Vercel Build Output support, and Wexts Shield.',
};

export default function Page() {
    return <HomePage />;
}
