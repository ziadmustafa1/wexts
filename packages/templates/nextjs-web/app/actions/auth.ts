'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api';

export type ActionState = {
    message?: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
};

export async function loginAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const errors: { email?: string[]; password?: string[] } = {};

    if (!email || !email.includes('@')) {
        errors.email = ['Invalid email address'];
    }

    if (!password || password.length < 6) {
        errors.password = ['Password must be at least 6 characters'];
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    try {
        // Use SDK - no URLs needed!
        const data = await api.auth.login({ email, password });

        // Store JWT token
        if (data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('wexts_token', data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });
        } else {
            return {
                message: 'Login failed: No token received',
            };
        }
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            message: error.message || 'Invalid credentials',
        };
    }

    redirect('/dashboard');
}

export async function registerAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    const errors: { email?: string[]; password?: string[] } = {};

    if (!email || !email.includes('@')) {
        errors.email = ['Invalid email address'];
    }

    if (!password || password.length < 6) {
        errors.password = ['Password must be at least 6 characters'];
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    try {
        // Use SDK - no URLs needed!
        const data = await api.auth.register({ email, password, name });

        // Store JWT token
        if (data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('wexts_token', data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            });
        }
    } catch (error: any) {
        console.error('Register error:', error);
        return {
            message: error.message || 'Registration failed',
        };
    }

    redirect('/dashboard');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('wexts_token');
    redirect('/login');
}
