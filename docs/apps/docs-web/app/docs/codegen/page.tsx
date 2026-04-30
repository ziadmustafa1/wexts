import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Codegen - Wexts',
    description: 'Generate Wexts RPC manifests and typed clients.',
};

export default function Page() {
    return <MarkdownDocContent slug="codegen" title="Codegen" />;
}
