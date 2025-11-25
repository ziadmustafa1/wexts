import { Badge } from '@/components/ui/badge';

export function InsightContent() {
    return (
        <article className="mdx-content">
            <Badge className="mb-4">Fusion Insight</Badge>
            <h1 id="insight">Fusion Insight GUI</h1>
            <p className="text-xl text-muted-foreground">
                Visual control plane for monitoring your application.
            </p>

            <h2 id="features">Features</h2>
            <ul>
                <li>Real-time RPC call monitoring</li>
                <li>Database browser and editor</li>
                <li>Service logs viewer</li>
                <li>Performance metrics dashboard</li>
            </ul>

            <h2 id="access">How to Access</h2>
            <p>
                In development mode, visit: <code>http://localhost:3001/insight</code>
            </p>
        </article>
    );
}
