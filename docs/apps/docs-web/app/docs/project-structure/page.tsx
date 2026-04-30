import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'Project Structure - Wexts',
    description: 'Wexts 4 verified starter structure.',
};

export default function Page() {
    return <MarkdownDocContent slug="project-structure" title="Project Structure" />;
}
