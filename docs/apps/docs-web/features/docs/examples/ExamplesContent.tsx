import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/mdx/Tabs';

export function ExamplesContent() {
    return (
        <article className="mdx-content">
            <Badge variant="success" className="mb-4">Examples</Badge>
            <h1 id="examples">Examples & Recipes</h1>
            <p className="text-xl text-muted-foreground">
                Real-world examples to help you build amazing applications with wexts.
            </p>

            <h2 id="authentication">🔐 Authentication Example</h2>
            <Tabs defaultValue="backend">
                <TabsList>
                    <TabsTrigger value="backend">Backend Service</TabsTrigger>
                    <TabsTrigger value="frontend">Frontend Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="backend">
                    <CodeBlock language="typescript" filename="auth.service.ts" showLineNumbers>
                        {`@Injectable()
export class AuthService {
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    
    const token = this.jwt.sign({ sub: user.id });
    return { user, token };
  }
}`}
                    </CodeBlock>
                </TabsContent>

                <TabsContent value="frontend">
                    <CodeBlock language="typescript" filename="login-form.tsx">
                        {`const handleLogin = async () => {
  const { user, token } = await wexts.auth.login(email, password);
  localStorage.setItem('token', token);
  router.push('/dashboard');
};`}
                    </CodeBlock>
                </TabsContent>
            </Tabs>

            <Callout type="success" title="Type Safety">
                Notice full autocomplete for <code>wexts.auth.login()</code>!
            </Callout>

            <h2 id="more-examples">More Examples</h2>
            <ul>
                <li>CRUD Operations</li>
                <li>File Upload</li>
                <li>Real-time Features</li>
                <li>Email Integration</li>
            </ul>
        </article>
    );
}
