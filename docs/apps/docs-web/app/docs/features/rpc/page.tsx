import { Metadata } from 'next';
import { RPCContent } from '@/features/docs/features/RPCContent';

export const metadata: Metadata = {
    title: 'RPC Auto-Linking - wexts Documentation',
    description: 'How RPC auto-linking works in wexts',
};

export default function Page() {
    return <RPCContent />;
}
