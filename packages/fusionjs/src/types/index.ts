export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}
