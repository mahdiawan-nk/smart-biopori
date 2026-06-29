// Ambil BASE_URL dari environment variable (.env)
const BASE_URL = 'http://localhost:8801';

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
    token?: string;
}

export class ApiError extends Error {
    status: number;
    info: any;

    constructor(message: string, status: number, info?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.info = info;
    }
}

/**
 * Core fetch wrapper untuk menangani request ke API
 */
async function fetcher<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, token, headers, ...customConfig } = options;

    // 1. Handle Query Parameters (jika ada)
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        url += `?${searchParams.toString()}`;
    }

    // 2. Setup Default Headers
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    // Tambahkan Authorization token jika dilewatkan
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method: customConfig.method || 'GET',
        headers: {
            ...defaultHeaders,
            ...headers, // Izinkan override headers jika dibutuhkan
        },
        ...customConfig,
    };

    // Otomatis stringify body jika berupa objek
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }

    // 3. Eksekusi Request
    const response = await fetch(url, config);

    // 4. Handle HTTP Errors
    if (!response.ok) {
        let errorInfo;
        try {
            errorInfo = await response.json();
        } catch {
            errorInfo = { message: 'Terjadi kesalahan pada server' };
        }

        throw new ApiError(
            errorInfo.message || `HTTP error! status: ${response.status}`,
            response.status,
            errorInfo
        );
    }

    // Jika response kosong (e.g., 204 No Content)
    if (response.status === 204) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}

// 5. Export metode HTTP yang siap pakai
export const api = {
    get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        fetcher<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        fetcher<T>(endpoint, { ...options, method: 'POST', body }),

    put: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        fetcher<T>(endpoint, { ...options, method: 'PUT', body }),

    patch: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        fetcher<T>(endpoint, { ...options, method: 'PATCH', body }),

    delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};