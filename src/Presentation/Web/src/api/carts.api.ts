import { apiClient as axios } from './axios';
import type { CartItem, CreateCartDto, UpdateCartDto } from '@/types/cart';

export const cartsApi = {
  getAll: async (): Promise<CartItem[]> => {
    const response = await axios.get<CartItem[]>('/carts');
    return response.data;
  },

  create: async (data: CreateCartDto): Promise<number> => {
    const response = await axios.post<number>('/carts', data);
    return response.data;
  },

  update: async (data: UpdateCartDto): Promise<void> => {
    await axios.put(`/carts/${data.id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`/carts/${id}`);
  },

  deleteAll: async (): Promise<void> => {
    await axios.delete('/carts/delete-all');
  },
};
