'use client';

import { useState, useEffect } from 'react';
import { useFusion } from './provider';

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
}

export interface UseAuthReturn {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

/**
 * useAuth hook - Authentication state management
 * Usage:
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * ```
 */
export function useAuth(): UseAuthReturn {
    const { client } = useFusion();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem('fusion_token');
        if (token) {
            // Validate token and load user
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const userData = await client.get<AuthUser>('/auth/me');
            setUser(userData);
        } catch (error) {
            localStorage.removeItem('fusion_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await client.post<{ token: string; user: AuthUser }>('/auth/login', {
            email,
            password,
        });
        localStorage.setItem('fusion_token', response.token);
        setUser(response.user);
    };

    const logout = async () => {
        localStorage.removeItem('fusion_token');
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };
}
