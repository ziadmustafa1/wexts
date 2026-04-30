import { Metadata } from 'next';
import { MarkdownDocContent } from '@/features/docs/MarkdownDocContent';

export const metadata: Metadata = {
    title: 'RPC - Wexts',
    description: 'Generated Wexts RPC with RpcService, RpcMethod, and useWexts.',
};

export default function Page() {
    return <MarkdownDocContent slug="rpc" title="RPC" />;
}
