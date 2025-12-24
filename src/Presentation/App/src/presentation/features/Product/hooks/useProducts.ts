import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { ApiResponse, PaginatedData, Product } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => api.get<ApiResponse<Product[]>>('/products'),
    select: (res) => res.data?.data || [],
  });
};

export const useFeaturedProducts = (category: string) => {
  return useQuery<Product[], Error>({
    queryKey: ['featuredProducts', category],
    queryFn: async () => {
      const response = await api.post<ApiResponse<PaginatedData<Product>>>(
        '/Products/search',
        {
          filter: {
            field: "category",
            operator: "eq",
            value: category,
          },
          sort: [
            {
              field: "price",
              dir: "asc",
            },
          ],
          index: 0,
          size: 5,
        }
      );
      return response.data?.data?.items || [];
    },
  });
};
