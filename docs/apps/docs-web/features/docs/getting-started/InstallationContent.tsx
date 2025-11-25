import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';

export function InstallationContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4">Installation</Badge>
                <h1 id="installation">Installation</h1>
                <p className="text-xl text-muted-foreground">
                    Learn how to install and configure wexts on your development machine.
                </p>
            </div>

            <h2 id="system-requirements">System Requirements</h2>
            <ul>
                <li>Node.js 18.17 or later</li>
                <li>pnpm 8.0 or later (recommended)</li>
                <li>macOS, Windows, or Linux</li>
            </ul>

            <h2 id="automatic-installation">Automatic Installation</h2>
            <p>
                The easiest way to create a new wexts project is using <code>create-wexts-app</code>:
            </p>

            <CodeBlock language="bash" filename="terminal">
                {`npx create-wexts-app@latest my-app`}
            </CodeBlock>

            <p>This command will:</p>
            <ul>
                <li>Create a new directory with your project name</li>
                <li>Set up the monorepo structure with TurboRepo</li>
                <li>Install all necessary dependencies</li>
                <li>Configure TypeScript, ESLint, and Prettier</li>
                <li>Set up Next.js frontend and NestJS backend</li>
            </ul>

            <h2 id="manual-installation">Manual Installation</h2>
            <p>
                If you prefer to set up your project manually, follow these steps:
            </p>

            <h3>1. Install pnpm</h3>
            <CodeBlock language="bash">
                {`npm install -g pnpm`}
            </CodeBlock>

            <h3>2. Clone Template</h3>
            <CodeBlock language="bash">
                {`git clone https://github.com/wexts/template my-app
cd my-app`}
            </CodeBlock>

            <h3>3. Install Dependencies</h3>
            <CodeBlock language="bash">
                {`pnpm install`}
            </CodeBlock>

            <h3>4. Set Up Environment</h3>
            <CodeBlock language="bash">
                {`cp .env.example .env`}
            </CodeBlock>

            <Callout type="info" title="Environment Variables">
                Make sure to configure your <code>.env</code> file with your database connection string and other required variables.
            </Callout>

            <h2 id="verify-installation">Verify Installation</h2>
            <p>
                Start the development servers to verify everything is working:
            </p>

            <CodeBlock language="bash">
                {`pnpm dev`}
            </CodeBlock>

            <p>
                You should see output indicating both servers are running:
            </p>
            <ul>
                <li>Frontend: <code>http://localhost:3000</code></li>
                <li>Backend: <code>http://localhost:5050</code></li>
            </ul>

            <Callout type="success" title="Installation Complete!">
                Your wexts development environment is ready. Continue to the{' '}
                <a href="/docs/getting-started/quick-start">Quick Start guide</a> to build your first application.
            </Callout>
        </article>
    );
}
