/**
 * Product Hooks - Using Repository Pattern
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { productRepository } from '@services/dependencyInjector';
import type { CreateProduct, UpdateProduct } from '@core/domain/entities/Product';

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
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => productRepository.getAll(),
  });
};

/**
 * Get single product by ID
 */
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productRepository.getById(id),
    enabled: !!id,
  });
};

/**
 * Search products
 */
export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productRepository.search({ query }),
    placeholderData: keepPreviousData,
    enabled: query.length > 0,
  });
};

/**
 * Create new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: CreateProduct) => productRepository.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create product');
    },
  });
};

/**
 * Update existing product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: UpdateProduct) => productRepository.update(product),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update product');
    },
  });
};

/**
 * Delete product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete product');
    },
  });
};
