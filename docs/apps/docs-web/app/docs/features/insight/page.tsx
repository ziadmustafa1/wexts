import { Metadata } from 'next';
import { InsightContent } from '@/features/docs/features/InsightContent';

export const metadata: Metadata = {
    title: 'Fusion Insight - wexts Documentation',
    description: 'Visual dashboard for monitoring your wexts application',
};

export default function Page() {
    return <InsightContent />;
}
