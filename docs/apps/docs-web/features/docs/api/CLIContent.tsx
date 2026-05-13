import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Zap, Package, FileCode } from 'lucide-react';

export function CLIContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">CLI Reference</Badge>
                <h1 id="cli-commands">CLI Commands</h1>
                <p className="text-xl text-muted-foreground">
                    Complete command-line interface reference for wexts framework.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <Card className="border-l-4 border-l-violet-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <Terminal className="w-10 h-10 text-violet-500 mb-3" />
                        <CardTitle>wexts create</CardTitle>
                        <CardDescription>Create the verified Wexts starter</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock language="bash">
                            {`npx wexts create my-app

# Options:
--template starter  # Verified default starter
--template legacy   # Deprecated compatibility template
--skip-install      # Skip dependency install`}
                        </CodeBlock>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <Zap className="w-10 h-10 text-blue-500 mb-3" />
                        <CardTitle>wexts generate</CardTitle>
                        <CardDescription>Generate code components</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock language="bash">
                            {`# Generate RPC client and manifest
npx wexts generate

# Scaffold an RPC service
npx wexts generate rpc <name>

# Scaffold supporting files
npx wexts generate service <name>
npx wexts generate module <name>
npx wexts generate entity <name>
npx wexts generate guard <name>
npx wexts generate config`}
                        </CodeBlock>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <Package className="w-10 h-10 text-green-500 mb-3" />
                        <CardTitle>wexts dev</CardTitle>
                        <CardDescription>Start development servers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock language="bash">
                            {`pnpm run dev

# Development runs the API compiler plus Wexts runtime.
# /rpc and Next routes share the web port.`}
                        </CodeBlock>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <FileCode className="w-10 h-10 text-orange-500 mb-3" />
                        <CardTitle>wexts build</CardTitle>
                        <CardDescription>Build for production</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock language="bash">
                            {`pnpm run build

# Generates RPC, compiles API, and builds Next.js.`}
                        </CodeBlock>
                    </CardContent>
                </Card>
            </div>

            <h2 id="advanced-commands">Advanced Commands</h2>

            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span className="text-primary">→</span> Production Runtime
                    </h3>
                    <CodeBlock language="bash">
                        {`pnpm run start

# Equivalent:
wexts start -c ./wexts.runtime.js`}
                    </CodeBlock>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span className="text-primary">→</span> Vercel Build Output
                    </h3>
                    <CodeBlock language="bash">
                        {`pnpm run vercel-build

# Equivalent:
wexts vercel-build -p apps/api -o apps/web/lib/wexts -c ./wexts.runtime.js`}
                    </CodeBlock>
                </div>
            </div>
        </article>
    );
}
