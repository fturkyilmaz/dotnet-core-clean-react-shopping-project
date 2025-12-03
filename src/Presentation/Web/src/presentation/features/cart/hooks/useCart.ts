/**
 * Cart Hooks - Using Repository Pattern
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartRepository } from '@services/dependencyInjector';
import type { AddCartItem, UpdateCartItem } from '@core/domain/entities/Cart';
import { useAppSelector } from '@/hooks/useRedux';

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartRepository.getAll(),
  });

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const addToCartMutation = useMutation({
    mutationFn: (data: AddCartItem) => {
      if (!isAuthenticated) {
        throw new Error('Please login to add items to cart');
      }
      return cartRepository.add(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Product added to cart');
    },
    onError: (error: any) => {
      if (error.message === 'Please login to add items to cart') {
        toast.info('Please login to add items to cart');
        navigate('/login');
      } else {
        toast.error('Failed to add product to cart');
      }
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: (data: UpdateCartItem) => cartRepository.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Failed to update cart item');
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (id: number) => cartRepository.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Product removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove product from cart');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartRepository.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared');
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return {
    cartItems,
    isLoading,
    error,
    addToCart: (data: AddCartItem) => addToCartMutation.mutate(data),
    updateCartItem: (data: UpdateCartItem) => updateCartItemMutation.mutate(data),
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
