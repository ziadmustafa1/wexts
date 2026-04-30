import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'CLI - Wexts',
    description: 'Wexts CLI commands.',
};

export default function Page() {
    return <MarkdownDocContent slug="cli" title="CLI" />;
}
