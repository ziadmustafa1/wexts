import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';

export function TypeSafetyContent() {
    return (
        <article className="mdx-content">
            <Badge className="mb-4">Type Safety</Badge>
            <h1 id="type-safety">End-to-End Type Safety</h1>
            <p className="text-xl text-muted-foreground">
                TypeScript everywhere. From your database schema to your UI components.
            </p>

            <CodeBlock language="typescript" showLineNumbers>
                {`// 1. Define your Prisma schema
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
}

// 2. Use in backend
async createUser(dto: CreateUserDto): Promise<User> {
  return this.db.user.create({ data: dto });
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
