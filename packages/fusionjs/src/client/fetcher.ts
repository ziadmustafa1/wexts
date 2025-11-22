// packages/api-client/src/fetcher.ts

export class FusionFetcher {
    private baseUrl: string;

    constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(method: string, path: string, body?: any): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Automatically attach Fusion Token if present
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('fusion_token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`Fusion API Error: ${response.statusText}`);
        }

        return response.json();
    }

    get<T>(path: string) { return this.request<T>('GET', path); }
    post<T>(path: string, body: any) { return this.request<T>('POST', path, body); }
    put<T>(path: string, body: any) { return this.request<T>('PUT', path, body); }
    delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const apiFetcher = new FusionFetcher();
