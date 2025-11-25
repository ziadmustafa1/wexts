import { Metadata } from 'next';
import { HomePage } from '@/features/home/HomePage';

export const metadata: Metadata = {
    title: 'wexts - Next.js + NestJS Unified Framework',
    description: 'The full-stack framework for perfectionists. Zero API boilerplate, type-safe from database to client.',
};

export default function Page() {
    return <HomePage />;
}
