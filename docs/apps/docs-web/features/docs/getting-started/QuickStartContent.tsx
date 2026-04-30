import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';

export function QuickStartContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4">Quick Start</Badge>
                <h1 id="quick-start">Quick Start Guide</h1>
                <p className="text-xl text-muted-foreground">
                    Create the verified Wexts 4 starter and run the same path used by release checks.
                </p>
            </div>

            <h2 id="create-project">1. Create a project</h2>
            <CodeBlock language="bash">
                {`npx wexts create my-app
cd my-app
pnpm install`}
            </CodeBlock>

            <h2 id="start-dev">2. Start development</h2>
            <CodeBlock language="bash">
                {`pnpm run dev`}
            </CodeBlock>

            <Callout type="info" title="Development mode">
                Development starts separate web and API processes for fast iteration.
                The single-port runtime is the production <code>wexts start</code> path.
            </Callout>

            <h2 id="generate-build-check">3. Verify the app</h2>
            <CodeBlock language="bash">
                {`pnpm run generate
pnpm run build
pnpm run doctor
pnpm run doctor:security`}
            </CodeBlock>

            <h2 id="rpc-example">4. RPC example</h2>
            <CodeBlock language="typescript" filename="apps/api/src/hello.service.ts" showLineNumbers>
                {`import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return \`Hello, \${name}!\`;
  }
}`}
            </CodeBlock>

            <CodeBlock language="typescript" filename="apps/web/app/page.tsx" showLineNumbers>
                {`'use client';

import { useWexts } from '@/lib/wexts-provider';

export default function Page() {
  const wexts = useWexts();

  async function run() {
    await wexts.hello.sayHello('Bob');
  }

  return <button onClick={run}>Say hello</button>;
}`}
            </CodeBlock>

            <h2 id="next-steps">Next Steps</h2>
            <ul>
                <li><a href="/docs/rpc">Read the RPC guide</a></li>
                <li><a href="/docs/runtime">Understand the production runtime</a></li>
                <li><a href="/docs/wexts-shield">Configure Wexts Shield</a></li>
                <li><a href="/docs/vercel-deployment">Deploy with Vercel Build Output</a></li>
            </ul>
        </article>
    );
}
