import { Metadata } from 'next';
import { RealtimeExampleContent } from '@/features/docs/examples/RealtimeExampleContent';

export const metadata: Metadata = {
    title: 'Real-time Example - wexts Documentation',
    description: 'Real-time features example with WebSockets',
};

export default function Page() {
    return <RealtimeExampleContent />;
}
