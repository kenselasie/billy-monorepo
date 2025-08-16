import { apiClient, API_ENDPOINTS, DEFAULT_STORE_SLUG, ApiResponse } from './client';

// Backend API Types
export interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  sku: string;
  quantity: number;
  in_stock: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'OUT_OF_STOCK';
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  storeId: string;
  images: string[];
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  categories: BackendProductCategory[];
  attributes: BackendProductAttribute[];
  created_at: string;
  updated_at: string;
}

export interface BackendProductCategory {
  id: string;
  name: string;
  slug: string;
  details?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface BackendProductAttribute {
  id: string;
  name: string;
  value: string;
  type: string;
}

export interface BackendStore {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  cover_image?: string;
  images: string[];
  is_active: boolean;
  orders_count: number;
  product_count: number;
  ownerId: string;
  addressId?: string;
  categories?: BackendCategory[];
  created_at: string;
  updated_at: string;
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  details?: string;
  icon?: string;
  image?: string;
  storeId: string;
  parentId?: string;
  products_count: number;
  store?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: BackendCategory[];
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string;
}

// Product Services
export const productService = {
  // Get all products for the store
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    storeSlug?: string;
  }) => {
    const queryParams: Record<string, string | number> = {};
    const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
    
    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.search) queryParams.search = params.search;
      if (params.category) queryParams.category = params.category;
      if (params.sort) queryParams.sort_by = params.sort;
      if (params.order) queryParams.sort_order = params.order;
    }

    return apiClient.get<BackendProduct[]>(API_ENDPOINTS.PRODUCTS_BY_STORE(storeSlug), queryParams);
  },

  // Get single product by ID
  getProductById: async (id: string) => {
    return apiClient.get<BackendProduct>(`${API_ENDPOINTS.PRODUCT_BY_ID}/${id}`);
  },

  // Get single product by slug
  getProductBySlug: async (slug: string) => {
    return apiClient.get<BackendProduct>(API_ENDPOINTS.PRODUCT_BY_SLUG(slug));
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const queryParams: Record<string, string | number> = {};
    
    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.search) queryParams.search = params.search;
    }

    return apiClient.get<BackendProduct[]>(
      `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY}/${categoryId}`,
      queryParams
    );
  },

  // Search products
  searchProducts: async (query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    storeSlug?: string;
  }) => {
    const queryParams: Record<string, string | number> = {
      search: query,
    };
    const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
    
    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.category) queryParams.category = params.category;
    }

    return apiClient.get<BackendProduct[]>(API_ENDPOINTS.PRODUCTS_BY_STORE(storeSlug), queryParams);
  },
};

// Category Services
export const categoryService = {
  // Get all categories (fallback for general use)
  getCategories: async () => {
    return apiClient.get<BackendCategory[]>(API_ENDPOINTS.CATEGORIES);
  },

  // Get categories by store slug
  getCategoriesByStore: async (storeSlug: string = DEFAULT_STORE_SLUG) => {
    return apiClient.get<BackendCategory[]>(API_ENDPOINTS.CATEGORIES_BY_STORE(storeSlug));
  },

  // Get single category by ID
  getCategoryById: async (id: string) => {
    return apiClient.get<BackendCategory>(`${API_ENDPOINTS.CATEGORY_BY_ID}/${id}`);
  },
};

// Store Services
export const storeService = {
  // Get store details by slug
  getStoreBySlug: async (storeSlug: string = DEFAULT_STORE_SLUG) => {
    return apiClient.get<ApiResponse<BackendStore>>(API_ENDPOINTS.STORE_BY_SLUG(storeSlug));
  },

  // Get store details (default implementation using default slug)
  getStore: async () => {
    return storeService.getStoreBySlug(DEFAULT_STORE_SLUG);
  },

  // Get all stores
  getStores: async () => {
    return apiClient.get<BackendStore[]>(API_ENDPOINTS.STORES);
  },
};

// Authentication Services
export const authService = {
  // Login
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
    
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },

  // Register
  register: async (userData: RegisterRequest) => {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.REGISTER, userData);
    
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },

  // Logout
  logout: () => {
    apiClient.setToken(null);
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!apiClient.getToken();
  },
};

// Health check
export const healthService = {
  checkHealth: async () => {
    return apiClient.get<{ status: string; timestamp: string }>(API_ENDPOINTS.HEALTH);
  },
};