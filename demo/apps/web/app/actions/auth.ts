'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

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
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                message: data.message || 'Invalid credentials',
            };
        }

        // Assuming the API returns { access_token: string }
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
    } catch (error) {
        console.error('Login error:', error);
        return {
            message: 'Something went wrong. Please try again.',
        };
    }

    redirect('/dashboard');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('wexts_token');
    redirect('/login');
}
