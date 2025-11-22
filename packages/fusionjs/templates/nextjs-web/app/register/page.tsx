'use client';

import { useState, FormEvent } from 'react';
import { useFusion } from 'wexts/next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { client } = useFusion();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await client.post<{ token: string; user: any }>('/auth/register', {
                email,
                password,
                name,
            });

            localStorage.setItem('fusion_token', response.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Get started with Fusion
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name (optional)
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 transition"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 transition"
                                placeholder="••••••••"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum 6 characters</p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                        <Link href="/login" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
