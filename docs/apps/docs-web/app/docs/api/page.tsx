import { Metadata } from 'next';
import { APIReferenceContent } from '@/features/docs/api/APIReferenceContent';

export const metadata: Metadata = {
    title: 'API Reference - wexts Documentation',
    description: 'Complete API reference for wexts CLI and configuration',
};

export default function Page() {
    return <APIReferenceContent />;
}
