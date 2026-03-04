/**
 * Product Hooks - Using Generated React Query API
 * All API calls are now integrated with React Query
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateProduct, UpdateProduct } from '@core/domain/entities/Product';
import {
  useGetApiV1Products,
  useGetApiV1ProductsId,
  usePostApiV1Products,
  usePutApiV1ProductsId,
  useDeleteApiV1ProductsId,
  usePostApiV1ProductsSearch,
} from '@/infrastructure/api/generated/products/products';
import type { DynamicQuery, PostApiV1ProductsSearchParams } from '@/infrastructure/api/generated/shoppingProjectAPI.schemas';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.all, 'list', { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

/**
 * Get all products
 */
export const useProducts = () => {
  const { data, isLoading, error } = useGetApiV1Products({
    query: {
      queryKey: productKeys.lists(),
      select: (response) => response.data.data || [],
    },
  });

  return {
    data,
    isLoading,
    error,
  };
};

/**
 * Get single product by ID
 */
export const useProduct = (id: number) => {
  const { data, isLoading, error } = useGetApiV1ProductsId(id, {
    query: {
      queryKey: productKeys.detail(id),
      select: (response) => response.data.data,
      enabled: !!id,
    },
  });

  return {
    data,
    isLoading,
    error,
  };
};

/**
 * Search products with dynamic query
 * Returns a mutation that can be called with search parameters
 */
export const useSearchProducts = () => {
  const queryClient = useQueryClient();

  return usePostApiV1ProductsSearch({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: productKeys.all });
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Search failed');
      },
    },
  });
};

/**
 * Create new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return usePostApiV1Products({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        toast.success('Product created successfully');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to create product');
      },
    },
  });
};

/**
 * Update existing product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return usePutApiV1ProductsId({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        toast.success('Product updated successfully');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to update product');
      },
    },
  });
};

/**
 * Delete product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useDeleteApiV1ProductsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        toast.success('Product deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete product');
      },
    },
  });
};
