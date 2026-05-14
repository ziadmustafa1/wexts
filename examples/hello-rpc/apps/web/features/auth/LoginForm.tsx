'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            await login(data);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px] animate-float" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-violet-500/20 blur-[100px] animate-float" style={{ animationDelay: '4s' }} />
            </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <Card className="glass border-white/20 shadow-2xl backdrop-blur-xl">
                    <CardHeader className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 mx-auto text-primary">
                            <Zap className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to continue to wexts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 animate-pulse-slow flex items-center gap-2">
                                    <span className="text-lg">⚠️</span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            className="pl-10 bg-secondary/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="pl-10 bg-secondary/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg shadow-primary/25 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Create account
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center mt-8 text-xs text-muted-foreground/60">
                    &copy; 2025 wexts Inc. All rights reserved.
                </p>
            </div>
        </div>
    );
}
