import { Metadata } from 'next';
import { ConfigContent } from '@/features/docs/api/ConfigContent';

export const metadata: Metadata = {
    title: 'Configuration - wexts Documentation',
    description: 'Configuration options for wexts',
};

export default function Page() {
    return <ConfigContent />;
}
