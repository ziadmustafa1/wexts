import { Metadata } from 'next';
import { QuickStartContent } from '@/features/docs/getting-started/QuickStartContent';

export const metadata: Metadata = {
    title: 'Quick Start - wexts Documentation',
    description: 'Quick start guide for building your first wexts application',
};

export default function Page() {
    return <QuickStartContent />;
}
