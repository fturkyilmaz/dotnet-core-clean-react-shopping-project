/**
 * Shopping cart type definitions
 */

import type { BaseEntity } from './common';

// ============================================================================
// Cart Item Types
// ============================================================================

/**
 * Item in the shopping cart
 */
export interface CartItem extends BaseEntity {
  title: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * Cart item creation DTO
 */
export interface AddToCartDto {
  id: number;
  title: string;
  price: number;
  image: string;
}

/**
 * Update cart item quantity
 */
export interface UpdateCartItemDto {
  id: number;
  quantity: number;
}

// ============================================================================
// Cart State Types
// ============================================================================

/**
 * Shopping cart state
 */
export interface CartState {
  items: CartItem[];
  total: number;
}

/**
 * Cart summary information
 */
export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

/**
 * Cart totals calculation
 */
export interface CartTotals {
  subtotal: number;
  total: number;
  itemCount: number;
}

// ============================================================================
// Cart Actions
// ============================================================================

/**
 * Cart action types for better type safety
 */
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: UpdateCartItemDto }
  | { type: 'CLEAR_CART' };
