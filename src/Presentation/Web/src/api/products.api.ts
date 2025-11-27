import { apiClient } from '@api/axios';
import type { Product, ProductsResponse, CreateProductDto } from '@/types/product';

// Re-export types for backward compatibility
export type { Product, ProductsResponse };

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/Products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/Products/${id}`);
    return response.data;
  },

  search: async (query: string, page = 0, size = 10): Promise<ProductsResponse> => {
    const response = await apiClient.post<ProductsResponse>(
      `/Products/search?index=${page}&size=${size}`,
      {
        filters: query ? [{ field: 'title', operator: 'contains', value: query }] : [],
      }
    );
    return response.data;
  },

  create: async (product: CreateProductDto): Promise<number> => {
    const response = await apiClient.post<number>('/Products', product);
    return response.data;
  },

  update: async (id: number, product: Product): Promise<void> => {
    await apiClient.put(`/Products/${id}`, product);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Products/${id}`);
  },
};
