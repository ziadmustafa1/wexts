import { connection } from 'next/server';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTodos, getUser } from './api';

export async function UserProfile() {
    await connection();
    try {
        const user = await getUser();
        if (!user) return null;

        return (
            <div className="space-y-2">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-3xl text-white font-bold mx-auto mb-4 shadow-lg shadow-primary/25">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold">User ID: {user.id}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
        );
    } catch (e) {
        return null;
    }
}

export async function TodoList() {
    await connection();
    try {
        const todos = await getTodos();

        return (
            <div className="space-y-4">
                {todos.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No todos found.</p>
                ) : (
                    todos.map((todo: any) => (
                        <div key={todo.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${todo.completed ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                                {todo.completed ? '✓' : '⚡'}
                            </div>
                            <div>
                                <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>{todo.title}</p>
                                <p className="text-xs text-muted-foreground">{new Date(todo.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    } catch (e) {
        return <p className="text-center text-destructive py-4">Failed to load todos.</p>;
    }
}

export function UserProfileSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-20 w-20 rounded-full bg-secondary mx-auto" />
            <div className="h-4 w-32 bg-secondary mx-auto rounded" />
        </div>
    );
}

export function TodoListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-16 w-full bg-secondary rounded-lg animate-pulse" />
            ))}
        </div>
    );
}
