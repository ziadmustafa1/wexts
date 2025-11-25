import { Metadata } from 'next';
import { TypeSafetyContent } from '@/features/docs/features/TypeSafetyContent';

export const metadata: Metadata = {
    title: 'Type Safety - wexts Documentation',
    description: 'End-to-end type safety with wexts',
};

export default function Page() {
    return <TypeSafetyContent />;
}
