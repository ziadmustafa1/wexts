import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/mdx/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, UserCheck, Key, Shield } from 'lucide-react';

export function AuthExampleContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    Authentication Example
                </Badge>
                <h1 id="auth-example">🔐 Complete Authentication System</h1>
                <p className="text-xl text-muted-foreground">
                    Build a full-featured authentication system with JWT, password hashing, and protected routes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                        <Lock className="text-green-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Features Included</CardTitle>
                        <CardDescription>Everything you need for auth</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <UserCheck size={16} className="text-green-500" />
                                User Registration
                            </li>
                            <li className="flex items-center gap-2">
                                <Key size={16} className="text-green-500" />
                                Login with JWT
                            </li>
                            <li className="flex items-center gap-2">
                                <Shield size={16} className="text-green-500" />
                                Password Hashing
                            </li>
                            <li className="flex items-center gap-2">
                                <Lock size={16} className="text-green-500" />
                                Protected Routes
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <CardHeader>
                        <CardTitle className="text-lg">Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1 text-sm">
                            <li>• <strong>bcrypt</strong> - Password hashing</li>
                            <li>• <strong>JWT</strong> - Token-based auth</li>
                            <li>• <strong>Prisma</strong> - User storage</li>
                            <li>• <strong>NestJS Guards</strong> - Route protection</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2 id="backend-setup">Backend Implementation</h2>

            <Tabs defaultValue="service">
                <TabsList>
                    <TabsTrigger value="service">Auth Service</TabsTrigger>
                    <TabsTrigger value="controller">Controller</TabsTrigger>
                    <TabsTrigger value="guard">Auth Guard</TabsTrigger>
                </TabsList>

                <TabsContent value="service">
                    <CodeBlock language="typescript" filename="auth.service.ts" showLineNumbers>
                        {`import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register(email: string, password: string) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = this.jwt.sign({ sub: user.id });
    
    return { user, token };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.jwt.sign({ sub: user.id });
    
    return { 
      user: { id: user.id, email: user.email },
      token 
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }
}`}
                    </CodeBlock>
                </TabsContent>

                <TabsContent value="controller">
                    <CodeBlock language="typescript" filename="auth.controller.ts" showLineNumbers>
                        {`import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: { email: string; password: string }) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { id: string }) {
    return this.authService.me(user.id);
  }
}`}
                    </CodeBlock>
                </TabsContent>

                <TabsContent value="guard">
                    <CodeBlock language="typescript" filename="jwt-auth.guard.ts" showLineNumbers>
                        {`import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}`}
                    </CodeBlock>
                </TabsContent>
            </Tabs>

            <h2 id="frontend-usage">Frontend Usage</h2>

            <CodeBlock language="typescript" filename="login-form.tsx" showLineNumbers>
                {`'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWexts } from '@/lib/wexts-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wexts = useWexts();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✨ Fully typed RPC call!
      const { user, token } = await wexts.auth.login(email, password);
      
      // Store token
      localStorage.setItem('token', token);
      
      // Redirect
      router.push('/dashboard');
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}`}
            </CodeBlock>

            <Callout type="success" title="✨ Magic of RPC Auto-Linking">
                Notice how <code>wexts.auth.login()</code> has full TypeScript autocomplete and knows the exact return type. No manual API definitions needed!
            </Callout>

            <h2 id="protected-routes">Protected Routes</h2>
            <CodeBlock language="typescript" filename="dashboard/page.tsx" showLineNumbers>
                {`'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWexts } from '@/lib/wexts-client';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const wexts = useWexts();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const userData = await wexts.auth.me();
      setUser(userData);
    } catch (error) {
      router.push('/login');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1>Welcome, {user.email}!</h1>
    </div>
  );
}`}
            </CodeBlock>
        </article>
    );
}
