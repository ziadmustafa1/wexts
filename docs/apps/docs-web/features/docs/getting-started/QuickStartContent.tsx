import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';

export function QuickStartContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4">Quick Start</Badge>
                <h1 id="quick-start">Quick Start Guide</h1>
                <p className="text-xl text-muted-foreground">
                    Build your first wexts application in under 5 minutes.
                </p>
            </div>

            <h2 id="create-project">1. Create New Project</h2>
            <CodeBlock language="bash">
                {`npx create-wexts-app my-blog-app
cd my-blog-app
pnpm install`}
            </CodeBlock>

            <h2 id="start-servers">2. Start Development Servers</h2>
            <CodeBlock language="bash">
                {`pnpm dev`}
            </CodeBlock>

            <Callout type="success">
                ✅ Frontend: <code>http://localhost:3000</code><br />
                ✅ Backend: <code>http://localhost:5050</code>
            </Callout>

            <h2 id="create-first-model">3. Create Your First Model</h2>
            <p>
                Edit <code>apps/api/prisma/schema.prisma</code>:
            </p>

            <CodeBlock language="prisma" filename="schema.prisma" showLineNumbers>
                {`model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`}
            </CodeBlock>

            <h2 id="migrate-database">4. Run Migration</h2>
            <CodeBlock language="bash">
                {`cd apps/api
npx prisma migrate dev --name add_posts`}
            </CodeBlock>

            <h2 id="create-service">5. Generate Service</h2>
            <CodeBlock language="bash">
                {`npx wexts generate service posts`}
            </CodeBlock>

            <h2 id="implement-logic">6. Implement Business Logic</h2>
            <CodeBlock language="typescript" filename="apps/api/src/posts/posts.service.ts" showLineNumbers>
                {`import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(title: string, content: string) {
    return this.prisma.post.create({
      data: { title, content, authorId: 'user-1' },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}`}
            </CodeBlock>

            <h2 id="use-frontend">7. Use in Frontend</h2>
            <CodeBlock language="typescript" filename="apps/web/app/page.tsx" showLineNumbers>
                {`'use client';

import { useEffect, useState } from 'react';
import { useWexts } from '@/lib/wexts-client';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const wexts = useWexts();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await wexts.posts.findAll();
    setPosts(data);
  };

  const createPost = async () => {
    await wexts.posts.create('My First Post', 'Hello wexts!');
    loadPosts();
  };

  return (
    <div className="p-8">
      <button onClick={createPost} className="btn">
        Create Post
      </button>
      {posts.map(post => (
        <div key={post.id} className="mt-4">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}`}
            </CodeBlock>

            <Callout type="success" title="🎉 Congratulations!">
                You've just built a full-stack application with wexts! Notice how you didn't write any API routes or fetch logic – it's all handled automatically by wexts RPC.
            </Callout>

            <h2 id="next-steps">Next Steps</h2>
            <ul>
                <li><a href="/docs/features">Explore all features</a></li>
                <li><a href="/docs/examples">View more examples</a></li>
                <li><a href="/docs/api">Read API documentation</a></li>
            </ul>
        </article>
    );
}
