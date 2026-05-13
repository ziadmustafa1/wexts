import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Terminal, Code, Rocket } from 'lucide-react';

export function GettingStartedContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge variant="new" className="mb-4">Getting Started</Badge>
                <h1 id="getting-started">Getting Started with wexts</h1>
                <p className="text-xl text-muted-foreground">
                    Build from the verified Wexts 4 starter with generated RPC,
                    a production runtime, and explicit release checks.
                </p>
            </div>

            <Callout type="info" title="Prerequisites">
                Before you begin, make sure you have Node.js 20+ and pnpm installed on your system.
            </Callout>

            <h2 id="installation">Installation</h2>
            <p>
                The fastest path is the published Wexts CLI. It creates the verified Hello RPC starter.
            </p>

            <CodeBlock language="bash" filename="terminal">
                {`npx wexts create my-app
cd my-app
pnpm install
pnpm run dev`}
            </CodeBlock>

            <Callout type="success" title="Project Created!">
                Development mode starts the API compiler watcher and Wexts runtime together, so <code>/rpc</code> and Next routes share the web port.
            </Callout>

            <h2 id="project-structure">Project Structure</h2>
            <p>
                After installation, your project will have the following structure:
            </p>

            <CodeBlock language="plaintext" showLineNumbers>
                {`my-app/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── app/
│   │   └── lib/
│   └── api/                  # NestJS backend
│       ├── src/
│       └── tsconfig.json
├── wexts.runtime.js
├── pnpm-workspace.yaml
├── package.json
└── README.md`}
            </CodeBlock>

            <h2 id="key-features">Key Features Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <Card>
                    <CardHeader>
                        <Zap className="text-primary mb-2" size={24} />
                        <CardTitle className="text-lg">RPC Auto-Linking</CardTitle>
                        <CardDescription>
                            Call backend functions from your frontend with full type safety.
                            Generated from explicit RPC metadata and committed manifest output.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <Terminal className="text-green-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Powerful CLI</CardTitle>
                        <CardDescription>
                            Generate components, services, and modules with a single command.
                            Boost your productivity.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <Code className="text-blue-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Type Safety</CardTitle>
                        <CardDescription>
                            TypeScript across backend service signatures and frontend calls.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <Rocket className="text-purple-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Modern Stack</CardTitle>
                        <CardDescription>
                            Built with Next.js 16, React 19, NestJS 11, Fastify 5, and TypeScript 5.9.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <h2 id="your-first-endpoint">Creating Your First Endpoint</h2>
            <p>
                Let's create a simple explicitly decorated RPC service.
                First, create a new service in your backend:
            </p>

            <CodeBlock language="bash" filename="terminal">
                {`npx wexts generate rpc hello`}
            </CodeBlock>

            <p>
                This will create a new service file. Update it with your logic:
            </p>

            <CodeBlock language="typescript" filename="apps/api/src/hello/hello.service.ts" showLineNumbers>
                {`import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return \`Hello, \${name}! Welcome to wexts.\`;
  }
}`}
            </CodeBlock>

            <p>
                Now you can call this from your frontend with full type safety:
            </p>

            <CodeBlock language="typescript" filename="apps/web/app/page.tsx" showLineNumbers>
                {`'use client';

import { useWexts } from '@/lib/wexts-client';

export default function Page() {
  const wexts = useWexts();

  const handleClick = async () => {
    // Fully typed! Your IDE knows about sayHello
    const result = await wexts.hello.sayHello('World');
    console.log(result); // "Hello, World! Welcome to wexts."
  };

  return <button onClick={handleClick}>Say Hello</button>;
}`}
            </CodeBlock>

            <Callout type="success" title="Magic! ✨">
                The generated client is produced from explicit Wexts RPC metadata.
                Run <code>wexts generate</code> after adding or changing RPC services.
            </Callout>

            <h2 id="next-steps">Next Steps</h2>
            <p>
                Now that you have a basic understanding, explore these topics:
            </p>

            <ul>
                <li><a href="/docs/rpc">Learn more about generated RPC</a></li>
                <li><a href="/docs/runtime">Understand the production runtime</a></li>
                <li><a href="/docs/cli">Check out CLI commands</a></li>
                <li><a href="/docs/known-limitations">Read known limitations</a></li>
            </ul>

            <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                    Need help? Join our{' '}
                    <a href="#" className="text-primary hover:underline">Discord community</a> or{' '}
                    <a href="#" className="text-primary hover:underline">open an issue on GitHub</a>.
                </p>
            </div>
        </article>
    );
}
