'use client';

import { useAuth, useFusion } from 'wexts/next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
}

export default function DashboardPage() {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const { client } = useFusion();
    const router = useRouter();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadTodos();
        }
    }, [isAuthenticated]);

    const loadTodos = async () => {
        try {
            const data = await client.get<Todo[]>('/todos');
            setTodos(data);
        } catch (err) {
            console.error('Failed to load todos:', err);
        }
    };

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;

        setLoading(true);
        try {
            await client.post('/todos', { title: newTodoTitle });
            setNewTodoTitle('');
            await loadTodos();
        } catch (err) {
            console.error('Failed to add todo:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTodo = async (id: string, completed: boolean) => {
        try {
            await client.put(`/todos/${id}`, { completed: !completed });
            await loadTodos();
        } catch (err) {
            console.error('Failed to update todo:', err);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            await client.delete(`/todos/${id}`);
            await loadTodos();
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-violet-600">Fusion Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto py-12 px-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        My Todos
                    </h2>

                    <form onSubmit={handleAddTodo} className="mb-8">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newTodoTitle}
                                onChange={(e) => setNewTodoTitle(e.target.value)}
                                placeholder="Add a new todo..."
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium disabled:opacity-50 transition"
                            >
                                Add
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">
                        {todos.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                No todos yet. Create one above!
                            </p>
                        ) : (
                            todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggleTodo(todo.id, todo.completed)}
                                        className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                                    />
                                    <span className={`flex-1 text-gray-900 dark:text-white ${todo.completed ? 'line-through opacity-50' : ''}`}>
                                        {todo.title}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
