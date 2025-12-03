/**
 * Custom Hook - useBasket (Legacy)
 * This is a placeholder for backward compatibility
 * Real cart functionality is handled by useCart hook
 */

import { useCart } from '@/presentation/features/cart/hooks/useCart';
import type { Product } from '@core/domain/entities/Product';

export const useBasket = () => {
  const { addToCart } = useCart();

  const addToBasket = (product: Product) => {
    addToCart({
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return {
    addToBasket,
  };
};
