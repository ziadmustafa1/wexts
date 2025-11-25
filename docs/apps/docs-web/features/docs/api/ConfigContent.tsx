import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, Shield } from 'lucide-react';

export function ConfigContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">Configuration</Badge>
                <h1 id="configuration">Configuration</h1>
                <p className="text-xl text-muted-foreground">
                    Configure your wexts application for development and production.
                </p>
            </div>

            <h2 id="wexts-config" className="flex items-center gap-2">
                <Settings className="text-primary" size={28} />
                wexts.config.ts
            </h2>

            <Card className="my-6 border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle>Main Configuration File</CardTitle>
                </CardHeader>
                <CardContent>
                    <CodeBlock language="typescript" filename="wexts.config.ts" showLineNumbers>
                        {`import { defineConfig } from 'wexts';

export default defineConfig({
  // RPC Configuration
  rpc: {
    enabled: true,
    endpoint: '/api/rpc',
    exclude: ['internal', 'private'],
  },

  // Fusion Insight Dashboard
  insight: {
    enabled: process.env.NODE_ENV === 'development',
    port: 3001,
    monitoring: true,
    auth: false, // Enable auth in production
  },

  // Database
  database: {
    autoMigrate: process.env.NODE_ENV === 'development',
    prisma: {
      log: ['query', 'error', 'warn'],
    },
  },
});`}
                    </CodeBlock>
                </CardContent>
            </Card>

            <h2 id="env-variables" className="flex items-center gap-2">
                <Shield className="text-green-500" size={28} />
                Environment Variables
            </h2>

            <Callout type="warning" title="Security First">
                Never commit <code>.env</code> files. Use <code>.env.example</code> as template.
            </Callout>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                        <Database className="text-green-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Database</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock language="bash" filename=".env">
                            {`DATABASE_URL="postgresql://user:pass@localhost:5432/db"
DIRECT_URL="postgresql://user:pass@localhost:5432/db"`}
                        </CodeBlock>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <Shield className="text-blue-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock language="bash" filename=".env">
                            {`JWT_SECRET="your-super-secret-key"
JWT_EXPIRY="7d"
BCRYPT_ROUNDS=10`}
                        </CodeBlock>
                    </CardContent>
                </Card>
            </div>

            <h2 id="next-config">Next.js Configuration</h2>
            <CodeBlock language="typescript" filename="next.config.ts" showLineNumbers>
                {`import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['yourdomain.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;`}
            </CodeBlock>

            <Callout type="info" title="Ready to Deploy?">
                Check out our <a href="/docs/deployment">deployment guide</a> for production setup.
            </Callout>
        </article>
    );
}
