import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Wexts Shield - Wexts',
    description: 'Application-layer protection in Wexts Shield.',
};

export default function Page() {
    return <MarkdownDocContent slug="wexts-shield" title="Wexts Shield" />;
}
