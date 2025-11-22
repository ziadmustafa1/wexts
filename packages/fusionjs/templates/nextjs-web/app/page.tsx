'use client';

import { useAuth } from 'wexts/next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        } else if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return null;
}
