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
                    Wexts provides a production-focused toolkit for generated RPC, a single-runtime production server,
                    and explicit security controls.
                </p>
            </div>

            <h2 id="generated-rpc">🔗 Generated RPC</h2>
            <p>
                The heart of wexts is generated RPC.
                It generates a typed client from explicit <code>@RpcService()</code> and <code>@RpcMethod()</code> metadata.
            </p>

            <Card className="my-6">
                <CardHeader>
                    <Zap className="text-primary mb-2" size={32} />
                    <CardTitle>Explicit RPC Metadata</CardTitle>
                    <CardDescription>
                        Define the service boundary explicitly, run codegen, and use the generated client.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold mb-2">Backend Service</h4>
                    <CodeBlock language="typescript" filename="users.service.ts">
                        {`@Injectable()
@RpcService({ name: 'users' })
export class UsersService {
  @RpcMethod()
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
                Wexts analyzes explicitly decorated services during codegen and generates TypeScript types
                and client methods that mirror your RPC boundary. Production start does not run codegen.
            </Callout>

            <h2 id="fusion-insight">📊 Fusion Insight GUI</h2>
            <p>
                Fusion Insight is an experimental development dashboard concept for monitoring and managing a Wexts app.
                It is not part of the verified production release path.
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
                            Database tooling is application-owned. Prisma can be used by an app, but it is not a Wexts core requirement.
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
                <li><a href="/docs/features/rpc">Generated RPC Guide</a></li>
                <li><a href="/docs/features/insight">Fusion Insight Details</a></li>
            </ul>
        </article>
    );
}
