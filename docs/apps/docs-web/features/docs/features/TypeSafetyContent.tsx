import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';

export function TypeSafetyContent() {
    return (
        <article className="mdx-content">
            <Badge className="mb-4">Type Safety</Badge>
            <h1 id="type-safety">End-to-End Type Safety</h1>
            <p className="text-xl text-muted-foreground">
                TypeScript across explicit RPC service signatures, generated client types, and frontend calls.
            </p>

            <CodeBlock language="typescript" showLineNumbers>
                {`// 1. Define backend service return types
type User = {
  id: string;
  email: string;
  name?: string;
};

// 2. Expose explicit RPC methods
@RpcMethod()
async createUser(dto: CreateUserDto): Promise<User> {
  return this.users.create(dto);
}

// 3. Call from frontend with full type safety
const newUser = await wexts.users.createUser({
  email: 'user@example.com',
  name: 'John Doe'
});
// ^ TypeScript knows this returns User type`}
            </CodeBlock>

            <Callout type="success" title="Benefits">
                Catch errors at compile time, not runtime. Get autocomplete everywhere.
            </Callout>
        </article>
    );
}
