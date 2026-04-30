import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Vercel Deployment - Wexts',
    description: 'Deploy Wexts with Vercel Build Output API support.',
};

export default function Page() {
    return <MarkdownDocContent slug="vercel-deployment" title="Vercel Deployment" />;
}
