import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Migration Guide - Wexts',
    description: 'Migrate to Wexts 4.',
};

export default function Page() {
    return <MarkdownDocContent slug="migration-guide" title="Migration Guide" />;
}
