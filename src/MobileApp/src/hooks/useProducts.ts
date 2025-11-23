import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Product } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<Product[]>('/products');
      return response.data;
    },
  });
};
