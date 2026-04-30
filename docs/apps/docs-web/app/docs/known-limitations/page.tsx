import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Known Limitations - Wexts',
    description: 'Known Wexts 4 limitations.',
};

export default function Page() {
    return <MarkdownDocContent slug="known-limitations" title="Known Limitations" />;
}
