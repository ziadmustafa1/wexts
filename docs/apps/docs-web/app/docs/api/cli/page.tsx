import { Metadata } from 'next';
import { CLIContent } from '@/features/docs/api/CLIContent';

export const metadata: Metadata = {
    title: 'CLI Commands - wexts Documentation',
    description: 'Complete CLI commands reference for wexts',
};

export default function Page() {
    return <CLIContent />;
}
