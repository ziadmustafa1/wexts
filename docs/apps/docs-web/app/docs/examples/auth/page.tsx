import { Metadata } from 'next';
import { AuthExampleContent } from '@/features/docs/examples/AuthExampleContent';

export const metadata: Metadata = {
    title: 'Authentication Example - wexts Documentation',
    description: 'Complete authentication example with wexts',
};

export default function Page() {
    return <AuthExampleContent />;
}
