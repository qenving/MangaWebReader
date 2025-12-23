const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        }
    }

    getToken(): string | null {
        if (this.token) return this.token;
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error ${response.status}`);
        }

        return response.json();
    }

    // Install endpoints
    install = {
        getStatus: () => this.request<{
            isInstalled: boolean;
            hasOwner: boolean;
            databaseConnected: boolean;
        }>('/install/status'),

        testDatabase: (config: {
            host: string;
            port: number;
            username: string;
            password: string;
            database: string;
        }) => this.request<{ success: boolean; error?: string }>('/install/test-database', {
            method: 'POST',
            body: JSON.stringify(config),
        }),

        createOwner: (data: {
            email: string;
            username: string;
            password: string;
        }) => this.request<{ success: boolean; error?: string }>('/install/create-owner', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

        complete: () => this.request<{ success: boolean; recoveryKey?: string }>('/install/complete', {
            method: 'POST',
        }),
    };

    // Auth endpoints
    auth = {
        login: (email: string, password: string) =>
            this.request<{
                accessToken: string;
                user: { id: string; email: string; username: string; role: string; avatarUrl: string | null };
            }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),

        register: (data: { email: string; username: string; password: string }) =>
            this.request<{
                accessToken: string;
                user: { id: string; email: string; username: string; role: string; avatarUrl: string | null };
            }>('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        me: () => this.request<{ id: string; email: string; username: string; role: string; avatarUrl: string | null }>('/auth/me'),
    };

    // Manga endpoints
    manga = {
        getAll: (params?: {
            page?: number;
            limit?: number;
            status?: string;
            type?: string;
            genre?: string;
            search?: string;
            sort?: 'latest' | 'popular' | 'rating';
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) searchParams.set(key, String(value));
                });
            }
            return this.request<{
                data: any[];
                meta: { total: number; page: number; limit: number; totalPages: number };
            }>(`/manga?${searchParams}`);
        },

        getBySlug: (slug: string) => this.request<any>(`/manga/${slug}`),
    };

    // Chapters endpoints
    chapters = {
        getLatest: (limit = 20) =>
            this.request<any[]>(`/chapters/latest?limit=${limit}`),

        getById: (id: string) => this.request<any>(`/chapters/${id}`),

        getByManga: (mangaId: string, page = 1, limit = 50) =>
            this.request<{
                data: any[];
                meta: { total: number; page: number; limit: number; totalPages: number };
            }>(`/chapters/manga/${mangaId}?page=${page}&limit=${limit}`),
    };
}

export const api = new ApiClient(API_BASE_URL);
export default api;
