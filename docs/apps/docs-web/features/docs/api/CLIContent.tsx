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
                        <CardTitle>create-wexts-app</CardTitle>
                        <CardDescription>Create a new wexts project</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock language="bash">
                            {`npx wexts my-app

# Options:
--template <name>   # Use specific template
--skip-install      # Skip dependencies
--use-npm          # Use npm instead of pnpm`}
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
                            {`# Generate service
npx wexts generate service <name>

# Generate controller
npx wexts generate controller <name>

# Generate resource (all)
npx wexts generate resource <name>`}
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
                            {`pnpm dev

# Starts both:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5050`}
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
                            {`pnpm build

# Outputs optimized builds
# for both frontend and backend`}
                        </CodeBlock>
                    </CardContent>
                </Card>
            </div>

            <h2 id="advanced-commands">Advanced Commands</h2>

            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span className="text-primary">→</span> Database Migrations
                    </h3>
                    <CodeBlock language="bash">
                        {`# Create migration
cd apps/api
npx prisma migrate dev --name <migration-name>

# Apply migrations
npx prisma migrate deploy`}
                    </CodeBlock>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span className="text-primary">→</span> Prisma Studio
                    </h3>
                    <CodeBlock language="bash">
                        {`# Open database GUI
cd apps/api
npx prisma studio`}
                    </CodeBlock>
                </div>
            </div>
        </article>
    );
}
