import { Metadata } from 'next';
import { ExamplesContent } from '@/features/docs/examples/ExamplesContent';

export const metadata: Metadata = {
  title: 'Examples - wexts Documentation',
  description: 'Real-world examples and code snippets for wexts framework',
};

export default function Page() {
  return <ExamplesContent />;
}
