import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

export function APIReferenceContent() {
    return (
        <article className="mdx-content">
            <Badge variant="outline" className="mb-4">API Reference</Badge>
            <h1 id="api-reference">API Reference</h1>
            <p className="text-xl text-muted-foreground">
                Complete reference for CLI commands, configuration options, and APIs.
            </p>

            <h2 id="cli-commands">CLI Commands</h2>

            <Card className="my-6">
                <CardHeader>
                    <Terminal className="text-primary mb-2" size={24} />
                    <CardTitle>Generate Commands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-1">Generate a Service</h4>
                        <CodeBlock language="bash">
                            {`npx wexts generate service <name>`}
                        </CodeBlock>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-1">Generate a Controller</h4>
                        <CodeBlock language="bash">
                            {`npx wexts generate controller <name>`}
                        </CodeBlock>
                    </div>
                </CardContent>
            </Card>

            <h2 id="configuration">Configuration</h2>
            <CodeBlock language="typescript" filename="wexts.config.ts">
                {`export default defineConfig({
  rpc: {
    enabled: true,
    endpoint: '/api/rpc',
  },
  insight: {
    enabled: process.env.NODE_ENV === 'development',
    port: 3001,
  },
});`}
            </CodeBlock>
        </article>
    );
}
