import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartsApi } from '../api/carts.api';
import type { CreateCartDto, UpdateCartDto } from '@/types/cart';
import { toast } from 'react-toastify';
import { useMemo } from 'react';

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: cartsApi.getAll,
  });

  const addToCartMutation = useMutation({
    mutationFn: cartsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Product added to cart');
    },
    onError: () => {
      toast.error('Failed to add product to cart');
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: cartsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Failed to update cart item');
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: cartsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Product removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove product from cart');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartsApi.deleteAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared');
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });

  const totalItems = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [cartItems]
  );

  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [cartItems]
  );

  return {
    cartItems,
    isLoading,
    error,
    addToCart: (data: CreateCartDto) => addToCartMutation.mutate(data),
    updateCartItem: (data: UpdateCartDto) => updateCartItemMutation.mutate(data),
    removeFromCart: (id: number) => removeFromCartMutation.mutate(id),
    clearCart: () => clearCartMutation.mutate(),
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartItemMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
    totalItems,
    totalPrice,
  };
};
