import { Metadata } from 'next';
import { DocsIndexContent } from '@/features/docs/DocsIndexContent';

export const metadata: Metadata = {
    title: 'Documentation - wexts',
    description: 'Complete documentation for the wexts framework',
};

export default function Page() {
    return <DocsIndexContent />;
}
