import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { ApiResponse, PaginatedData, Product } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<Product[]>('/products');
      return response.data;
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

      console.log("Featured Products API Response:", response.data?.data?.items);
      // Return the items array from the paginated response
      return response.data?.data?.items || [];
    },
  });
};
