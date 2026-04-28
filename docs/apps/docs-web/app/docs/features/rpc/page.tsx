import { Metadata } from 'next';
import { RPCContent } from '@/features/docs/features/RPCContent';

export const metadata: Metadata = {
    title: 'Generated RPC - wexts Documentation',
    description: 'How generated RPC works in wexts',
};

export default function Page() {
    return <RPCContent />;
}
