import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';

export function RPCContent() {
    return (
        <article className="mdx-content">
            <Badge className="mb-4">RPC Auto-Linking</Badge>
            <h1 id="rpc">RPC Auto-Linking</h1>
            <p className="text-xl text-muted-foreground">
                Call server functions from client with zero configuration.
            </p>

            <h2 id="how-it-works">How It Works</h2>
            <p>wexts automatically generates a type-safe SDK from your backend services.</p>

            <CodeBlock language="typescript">
                {`// Backend service
@Injectable()
export class PostsService {
  async getPosts() {
    return this.db.post.findMany();
  }
}

// Frontend - automatically available!
const posts = await wexts.posts.getPosts();`}
            </CodeBlock>
        </article>
    );
}
