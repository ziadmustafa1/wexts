import { Metadata } from 'next';
import { FeaturesContent } from '@/features/docs/features/FeaturesContent';

export const metadata: Metadata = {
    title: 'Features - wexts Documentation',
    description: 'Explore the powerful features of wexts framework',
};

export default function Page() {
    return <FeaturesContent />;
}
