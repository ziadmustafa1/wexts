import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Troubleshooting - Wexts',
    description: 'Troubleshoot Wexts projects.',
};

export default function Page() {
    return <MarkdownDocContent slug="troubleshooting" title="Troubleshooting" />;
}
