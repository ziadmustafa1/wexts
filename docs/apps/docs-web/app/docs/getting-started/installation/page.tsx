import { Metadata } from 'next';
import { InstallationContent } from '@/features/docs/getting-started/InstallationContent';

export const metadata: Metadata = {
    title: 'Installation - wexts Documentation',
    description: 'Install and configure wexts on your system',
};

export default function Page() {
    return <InstallationContent />;
}
