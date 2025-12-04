import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { ApiResponse, PaginatedData, Product } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>('/products');
      return response.data?.data || [];
    },
  });
};


export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const response = await api.post<ApiResponse<PaginatedData<Product>>>('/Products/search', {
        filter: {
          field: "category",
          operator: "eq",
          value: "electronics"
        },
        sort: [
          {
            field: "price",
            dir: "asc"
          }
        ],
        index: 0,
        size: 5,
      });

      return response.data?.data?.items || [];
    },
  });
};
