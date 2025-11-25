import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Activity, Database, Layers, Sparkles, Terminal } from 'lucide-react';

export function FeaturesContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4">Features</Badge>
                <h1 id="features">Core Features</h1>
                <p className="text-xl text-muted-foreground">
                    Discover what makes wexts the perfect framework for building modern full-stack applications.
                </p>
            </div>

            <h2 id="rpc-auto-linking">🔗 RPC Auto-Linking</h2>
            <p>
                The heart of wexts is its RPC (Remote Procedure Call) auto-linking system.
                It automatically generates a fully type-safe client SDK from your NestJS backend services.
            </p>

            <Card className="my-6">
                <CardHeader>
                    <Zap className="text-primary mb-2" size={32} />
                    <CardTitle>Zero Configuration Required</CardTitle>
                    <CardDescription>
                        No need to manually define API routes, fetch logic, or type definitions.
                        wexts does it all automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold mb-2">Backend Service</h4>
                    <CodeBlock language="typescript" filename="users.service.ts">
                        {`@Injectable()
export class UsersService {
  async getUser(id: string): Promise<User> {
    return this.db.user.findUnique({ where: { id } });
  }
}`}
                    </CodeBlock>

                    <h4 className="font-semibold mb-2 mt-4">Frontend Usage</h4>
                    <CodeBlock language="typescript" filename="page.tsx">
                        {`const user = await wexts.users.getUser('123');
// ✨ Fully typed! TypeScript knows User type`}
                    </CodeBlock>
                </CardContent>
            </Card>

            <Callout type="info" title="How it works">
                wexts analyzes your NestJS services at build time and generates TypeScript types
                and client methods that mirror your backend API. This happens automatically in development mode.
            </Callout>

            <h2 id="fusion-insight">📊 Fusion Insight GUI</h2>
            <p>
                A powerful visual dashboard for monitoring and managing your full-stack application.
                Available at <code>http://localhost:3001/insight</code> in development mode.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <Card>
                    <CardHeader>
                        <Activity className="text-green-500 mb-2" size={24} />
                        <CardTitle className="text-lg">RPC Monitor</CardTitle>
                        <CardDescription>
                            See all RPC calls in real-time with request/response payloads, timing, and status codes.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <Database className="text-blue-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Database Manager</CardTitle>
                        <CardDescription>
                            Browse and edit your Prisma models directly from the GUI. Perfect for development.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <Terminal className="text-purple-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Service Logs</CardTitle>
                        <CardDescription>
                            View logs from all your services in one place with filtering and search capabilities.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <Sparkles className="text-yellow-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                        <CardDescription>
                            Track response times, error rates, and system health at a glance.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <h2 id="more-features">More Features</h2>
            <ul>
                <li><a href="/docs/features/type-safety">End-to-End Type Safety</a></li>
                <li><a href="/docs/features/rpc">RPC Auto-Linking Deep Dive</a></li>
                <li><a href="/docs/features/insight">Fusion Insight Details</a></li>
            </ul>
        </article>
    );
}
