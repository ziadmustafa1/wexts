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
                    Everything you need to build your first full-stack application with wexts.
                    Get up and running in minutes.
                </p>
            </div>

            <Callout type="info" title="Prerequisites">
                Before you begin, make sure you have Node.js 18+ and pnpm installed on your system.
            </Callout>

            <h2 id="installation">Installation</h2>
            <p>
                The fastest way to get started is using the <code>create-wexts-app</code> CLI.
                This will scaffold a complete full-stack application with all the best practices built-in.
            </p>

            <CodeBlock language="bash" filename="terminal">
                {`npx wexts my-app
cd my-app
pnpm install
pnpm dev`}
            </CodeBlock>

            <Callout type="success" title="Project Created!">
                Your wexts application is now running at <code>http://localhost:3000</code> (frontend)
                and <code>http://localhost:5050</code> (backend).
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
│   │   ├── components/
│   │   ├── features/
│   │   └── lib/
│   └── api/                  # NestJS backend
│       ├── src/
│       ├── prisma/
│       └── test/
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── shared/               # Shared types & DTOs
│   └── config/               # Shared config
├── package.json
└── turbo.json`}
            </CodeBlock>

            <h2 id="key-features">Key Features Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <Card>
                    <CardHeader>
                        <Zap className="text-primary mb-2" size={24} />
                        <CardTitle className="text-lg">RPC Auto-Linking</CardTitle>
                        <CardDescription>
                            Call backend functions from your frontend with full type safety.
                            No manual API definitions needed.
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
                            End-to-end TypeScript from database to UI.
                            Catch errors at compile time, not runtime.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <Rocket className="text-purple-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Modern Stack</CardTitle>
                        <CardDescription>
                            Built with Next.js 16, React 19, NestJS 10.
                            Always using the latest and greatest.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <h2 id="your-first-endpoint">Creating Your First Endpoint</h2>
            <p>
                Let's create a simple endpoint to see how RPC auto-linking works.
                First, create a new service in your backend:
            </p>

            <CodeBlock language="bash" filename="terminal">
                {`npx wexts generate service hello`}
            </CodeBlock>

            <p>
                This will create a new service file. Update it with your logic:
            </p>

            <CodeBlock language="typescript" filename="apps/api/src/hello/hello.service.ts" showLineNumbers>
                {`import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
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
                Notice how you didn't need to define any API routes or fetch logic.
                wexts automatically generates a type-safe SDK for your backend services.
            </Callout>

            <h2 id="next-steps">Next Steps</h2>
            <p>
                Now that you have a basic understanding, explore these topics:
            </p>

            <ul>
                <li><a href="/docs/features/rpc">Learn more about RPC Auto-Linking</a></li>
                <li><a href="/docs/features/insight">Explore the Fusion Insight GUI</a></li>
                <li><a href="/docs/api">Check out the API Reference</a></li>
                <li><a href="/docs/examples">See complete examples</a></li>
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
