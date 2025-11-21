import { apiClient } from './axios';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface ProductsResponse {
  items: Product[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get('/Products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/Products/${id}`);
    return response.data;
  },

  search: async (query: string, page = 0, size = 10): Promise<ProductsResponse> => {
    const response = await apiClient.post(`/Products/search?index=${page}&size=${size}`, {
      filters: query ? [{ field: 'title', operator: 'contains', value: query }] : [],
    });
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>): Promise<number> => {
    const response = await apiClient.post('/Products', product);
    return response.data;
  },

  update: async (id: number, product: Product): Promise<void> => {
    await apiClient.put(`/Products/${id}`, product);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Products/${id}`);
  },
};
