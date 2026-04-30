import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Runtime - Wexts',
    description: 'Wexts single-port production runtime.',
};

export default function Page() {
    return <MarkdownDocContent slug="runtime" title="Runtime" />;
}
