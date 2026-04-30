import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'VPS Deployment - Wexts',
    description: 'Deploy Wexts with wexts start on VPS or Node hosting.',
};

export default function Page() {
    return <MarkdownDocContent slug="vps-deployment" title="VPS Deployment" />;
}
