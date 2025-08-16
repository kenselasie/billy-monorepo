import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { productService, categoryService, storeService } from '../api/services';
import { mapBackendProductsToFrontend, mapBackendProductToFrontend, mapBackendCategoriesToFrontend } from '../api/mappers';
import { Product, Category } from '../types';
import { DEFAULT_STORE_SLUG } from '../api/client';

// Query Keys
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  STORE: 'store',
  STORES: 'stores',
} as const;

// Products Hooks
export const useProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  storeSlug?: string;
}) => {
  const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, storeSlug, params],
    queryFn: async () => {
      const backendProducts = await productService.getProducts({...params, storeSlug});
      return mapBackendProductsToFrontend(backendProducts);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: async () => {
      const backendProduct = await productService.getProductById(id);
      return mapBackendProductToFrontend(backendProduct);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, 'slug', slug],
    queryFn: async () => {
      const backendProduct = await productService.getProductBySlug(slug);
      return mapBackendProductToFrontend(backendProduct);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useProductsByCategory = (categoryId: string, params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'category', categoryId, params],
    queryFn: async () => {
      const backendProducts = await productService.getProductsByCategory(categoryId, params);
      return mapBackendProductsToFrontend(backendProducts);
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useSearchProducts = (query: string, params?: {
  page?: number;
  limit?: number;
  category?: string;
  storeSlug?: string;
}) => {
  const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'search', storeSlug, query, params],
    queryFn: async () => {
      const backendProducts = await productService.searchProducts(query, {...params, storeSlug});
      return mapBackendProductsToFrontend(backendProducts);
    },
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    refetchOnWindowFocus: false,
  });
};

// Categories Hooks
export const useCategories = (params?: { storeSlug?: string }) => {
  const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, storeSlug],
    queryFn: async () => {
      const backendCategories = await categoryService.getCategoriesByStore(storeSlug);
      return mapBackendCategoriesToFrontend(backendCategories);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORY, id],
    queryFn: async () => {
      const backendCategory = await categoryService.getCategoryById(id);
      return mapBackendCategoriesToFrontend([backendCategory])[0];
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Store Hooks
export const useStore = (params?: { storeSlug?: string }) => {
  const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
  return useQuery({
    queryKey: [QUERY_KEYS.STORE, storeSlug],
    queryFn: async () => {
      return storeService.getStoreBySlug(storeSlug);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

export const useStoreBySlug = (params: { storeSlug: string }) => {
  const { storeSlug } = params;
  return useQuery({
    queryKey: [QUERY_KEYS.STORE, 'slug', storeSlug],
    queryFn: async () => {
      return storeService.getStoreBySlug(storeSlug);
    },
    enabled: !!storeSlug,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

export const useStores = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.STORES],
    queryFn: async () => {
      return storeService.getStores();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

// Featured Products Hook (using the first 8 products)
export const useFeaturedProducts = (params?: { storeSlug?: string }) => {
  const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'featured', storeSlug],
    queryFn: async () => {
      const backendProducts = await productService.getProducts({ limit: 8, storeSlug });
      return mapBackendProductsToFrontend(backendProducts);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Popular Products Hook (mock implementation - in production, this would be based on sales/ratings)
export const usePopularProducts = (params?: { storeSlug?: string }) => {
  const storeSlug = params?.storeSlug || DEFAULT_STORE_SLUG;
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'popular', storeSlug],
    queryFn: async () => {
      const backendProducts = await productService.getProducts({ limit: 6, storeSlug });
      return mapBackendProductsToFrontend(backendProducts);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};