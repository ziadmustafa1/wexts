import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export function DocsIndexContent() {
    return (
        <article className="mdx-content">
            <h1 id="welcome">Welcome to wexts Documentation</h1>
            <p className="text-xl text-muted-foreground">
                Everything you need to know about building full-stack applications with wexts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <Link
                    href="/docs/getting-started"
                    className="group p-6 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
                >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            Getting Started
                        </h3>
                        <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-muted-foreground">
                        Install wexts and create your first full-stack application in minutes
                    </p>
                </Link>

                <Link
                    href="/docs/features"
                    className="group p-6 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
                >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            Features
                        </h3>
                        <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-muted-foreground">
                        Explore RPC auto-linking, Fusion Insight, and other powerful features
                    </p>
                </Link>

                <Link
                    href="/docs/examples"
                    className="group p-6 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
                >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            Examples
                        </h3>
                        <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-muted-foreground">
                        Real-world code examples including auth, CRUD, file uploads, and more
                    </p>
                </Link>

                <Link
                    href="/docs/api"
                    className="group p-6 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
                >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            API Reference
                        </h3>
                        <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-muted-foreground">
                        Complete API documentation for CLI commands and configuration
                    </p>
                </Link>
            </div>
        </article>
    );
}
