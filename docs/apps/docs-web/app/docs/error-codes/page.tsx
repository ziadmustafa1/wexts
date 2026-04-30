import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Error Codes - Wexts',
    description: 'Wexts error codes, fixes, and docs slugs.',
};

export default function Page() {
    return <MarkdownDocContent slug="error-codes" title="Error Codes" />;
}
