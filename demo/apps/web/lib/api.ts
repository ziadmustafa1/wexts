/**
 * WEXTS Internal SDK
 * Type-safe API client - ZERO URLs needed!
 * Works in both Client and Server Components
 */

// HTTP client - uses relative paths only
async function request<T>(method: string, path: string, data?: any): Promise<T> {
    const url = `/api${path}`;

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
}

// ==========================================
// TYPE-SAFE API - NO URLs ANYWHERE!
// ==========================================

export const api = {
    /**
     * Authentication API
     */
    auth: {
        /**
         * Register new user
         * @example await api.auth.register({ email, password, name })
         */
        register: (data: { email: string; password: string; name?: string }) =>
            request<{ user: any; access_token: string }>('POST', '/auth/register', data),

        /**
         * Login user
         * @example await api.auth.login({ email, password })
         */
        login: (data: { email: string; password: string }) =>
            request<{ user: any; access_token: string }>('POST', '/auth/login', data),

        /**
         * Get current user
         * @example const user = await api.auth.me()
         */
        me: () => request<any>('GET', '/auth/me'),
    },

    /**
     * Users API
     */
    users: {
        /**
         * Get current user profile
         * @example const profile = await api.users.me()
         */
        me: () => request<any>('GET', '/users/me'),
    },

    /**
     * Todos API
     */
    todos: {
        /**
         * Get all todos
         * @example const todos = await api.todos.findAll()
         */
        findAll: () => request<any[]>('GET', '/todos'),

        /**
         * Get single todo
         * @example const todo = await api.todos.findOne('123')
         */
        findOne: (id: string) => request<any>('GET', `/todos/${id}`),

        /**
         * Create new todo
         * @example await api.todos.create({ title: 'Task', description: 'Do it' })
         */
        create: (data: { title: string; description?: string }) =>
            request<any>('POST', '/todos', data),

        /**
         * Update todo
         * @example await api.todos.update('123', { completed: true })
         */
        update: (id: string, data: { title?: string; description?: string; completed?: boolean }) =>
            request<any>('PUT', `/todos/${id}`, data),

        /**
         * Delete todo
         * @example await api.todos.delete('123')
         */
        delete: (id: string) => request<void>('DELETE', `/todos/${id}`),
    },
};

/**
 * Export type-safe API
 */
export type API = typeof api;
