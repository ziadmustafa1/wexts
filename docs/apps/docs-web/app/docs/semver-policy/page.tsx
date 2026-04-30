import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Semver Policy - Wexts',
    description: 'Wexts versioning and release policy.',
};

export default function Page() {
    return <MarkdownDocContent slug="semver-policy" title="Semver Policy" />;
}
