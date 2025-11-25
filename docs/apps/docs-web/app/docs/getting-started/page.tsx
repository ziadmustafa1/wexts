import { Metadata } from 'next';
import { GettingStartedContent } from '@/features/docs/getting-started/GettingStartedContent';

export const metadata: Metadata = {
    title: 'Getting Started - wexts Documentation',
    description: 'Get started with wexts - installation, setup, and your first project',
};

export default function Page() {
    return <GettingStartedContent />;
}
