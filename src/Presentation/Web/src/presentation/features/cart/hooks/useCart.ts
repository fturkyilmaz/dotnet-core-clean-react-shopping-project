/**
 * Cart Hooks - Using Generated React Query API
 * All API calls are now integrated with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import {
  useGetApiV1Carts,
  usePostApiV1Carts,
  usePutApiV1CartsId,
  useDeleteApiV1CartsId,
  useDeleteApiV1CartsDeleteAll,
} from '@/infrastructure/api/generated/carts/carts';
import type { CreateCartCommand, UpdateCartCommand } from '@/infrastructure/api/generated/shoppingProjectAPI.schemas';

export const cartKeys = {
  all: ['cart'] as const,
  list: () => [...cartKeys.all, 'list'] as const,
  detail: (id: number) => [...cartKeys.all, 'detail', id] as const,
};

/**
 * Main cart hook - manages cart state and operations
 */
export const useCart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch cart items
  const { data: cartItems = [], isLoading, error } = useGetApiV1Carts({
    query: {
      queryKey: cartKeys.list(),
      select: (response) => response.data.data || [],
      enabled: isAuthenticated,
    },
  });

  // Add to cart mutation
  const addToCartMutation = usePostApiV1Carts({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: cartKeys.list() });
        toast.success('Product added to cart');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to add product to cart');
      },
    },
  });

  // Update cart item mutation
  const updateCartItemMutation = usePutApiV1CartsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: cartKeys.list() });
        toast.success('Cart updated');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to update cart');
      },
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useDeleteApiV1CartsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: cartKeys.list() });
        toast.success('Product removed from cart');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to remove product from cart');
      },
    },
  });

  // Clear cart mutation
  const clearCartMutation = useDeleteApiV1CartsDeleteAll({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: cartKeys.list() });
        toast.success('Cart cleared');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to clear cart');
      },
    },
  });

  const addToCart = (data: CreateCartCommand) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCartMutation.mutate({ data });
  };

  const updateCartItem = (id: number, data: UpdateCartCommand) => {
    updateCartItemMutation.mutate({ id, data });
  };

  const removeFromCart = (id: number) => {
    removeFromCartMutation.mutate({ id });
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  // Calculate totals
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0),
    [cartItems]
  );

  return {
    cartItems,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartItemMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
    totalItems,
    totalPrice,
  };
};
