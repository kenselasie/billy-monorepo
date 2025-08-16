const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:5001';
const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || 'grocery-store';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: 'products',
  PRODUCTS_BY_STORE: (storeSlug: string) => `products/store/slug/${storeSlug}`,
  PRODUCTS_BY_CATEGORY: 'products/category',
  PRODUCT_BY_ID: 'products',
  PRODUCT_BY_SLUG: (slug: string) => `products/slug/${slug}`,
  
  // Categories
  CATEGORIES: 'category',
  CATEGORIES_BY_STORE: (storeSlug: string) => `category/store/${storeSlug}`,
  CATEGORY_BY_ID: 'category',
  
  // Store
  STORES: 'store',
  STORE_BY_SLUG: (storeSlug: string) => `store/slug/${storeSlug}`,
  
  // Authentication
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  
  // Health
  HEALTH: 'health',
};

// Export the default store slug for easy access
export const DEFAULT_STORE_SLUG = STORE_SLUG;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
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

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;