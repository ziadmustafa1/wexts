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
                    Install Wexts 4 using the published CLI and the verified starter.
                </p>
            </div>

            <h2 id="requirements">Requirements</h2>
            <ul>
                <li>Node.js 20 or newer for the current verified packages</li>
                <li>pnpm for workspace installs and scripts</li>
                <li>A deployment target for either Node/VPS or Vercel Build Output</li>
            </ul>

            <h2 id="create">Create a starter</h2>
            <CodeBlock language="bash" filename="terminal">
                {`npx wexts create my-app
cd my-app
pnpm install`}
            </CodeBlock>

            <p>The default starter includes <code>apps/api</code>, <code>apps/web</code>, <code>wexts.runtime.js</code>, generated RPC output, and strict doctor checks.</p>

            <h2 id="verify">Verify installation</h2>
            <CodeBlock language="bash">
                {`pnpm run generate
pnpm run build
pnpm run doctor
pnpm run doctor:security`}
            </CodeBlock>

            <Callout type="info" title="Legacy template">
                Deprecated compatibility templates are only available through
                <code> wexts create my-app --template legacy</code>. The legacy path is not the canonical Wexts 4 starter.
            </Callout>
        </article>
    );
}
