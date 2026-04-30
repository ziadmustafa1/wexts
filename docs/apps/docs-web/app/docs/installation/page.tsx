import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Installation - Wexts',
    description: 'Install Wexts 4 and create a verified starter application.',
};

export default function Page() {
    return <MarkdownDocContent slug="installation" title="Installation" />;
}
