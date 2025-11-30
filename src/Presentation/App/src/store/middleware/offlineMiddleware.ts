import { Middleware } from '@reduxjs/toolkit';
import localStorageService from '@/services/localStorage';
import { CartItem } from '@/types';

/**
 * Middleware that intercepts cart actions and handles offline storage
 * Queues operations when offline and persists state
 */
export const offlineMiddleware: Middleware = (store) => (next) => async (action) => {
  // Only intercept cart-related actions
  if (
    action.type?.startsWith('cart/') &&
    !action.type.includes('fulfilled') &&
    !action.type.includes('rejected')
  ) {
    const actionType = action.type;

    try {
      // Handle different cart actions
      if (actionType === 'cart/addCartItemAsync' || actionType === 'cart/addToCart') {
        const cartItem: CartItem = action.payload;
        await localStorageService.addCartItem(cartItem);
      } else if (actionType === 'cart/updateCartItem') {
        const { cartId, quantity } = action.payload;
        // Update in local storage
        await localStorageService.updateCartItem({
          id: cartId,
          quantity,
        } as CartItem);
      } else if (actionType === 'cart/removeCartItem') {
        const { id } = action.payload;
        await localStorageService.removeCartItem(id);
      } else if (actionType === 'cart/clearCart') {
        await localStorageService.clearCartItems();
      }

      console.log(`Offline middleware: Processed ${actionType}`);
    } catch (error) {
      console.error(`Offline middleware error for ${actionType}:`, error);
      // Don't stop the action, just log the error
    }
  }

  // Always call next to continue the action
  return next(action);
};

export default offlineMiddleware;
