/**
 * Cart Repository Port
 * Interface that must be implemented by infrastructure layer
 */

import type { CartItem, AddCartItem, UpdateCartItem } from '../entities/Cart';

/**
 * Port for cart data access
 * Must be implemented in infrastructure layer
 */
export interface ICartRepository {
  /**
   * Get all cart items
   */
  getAll(): Promise<CartItem[]>;

  /**
   * Get cart item by ID
   */
  getById(id: number): Promise<CartItem>;

  /**
   * Add item to cart
   */
  add(item: AddCartItem): Promise<CartItem>;

  /**
   * Update cart item quantity
   */
  update(item: UpdateCartItem): Promise<CartItem>;

  /**
   * Remove item from cart
   */
  remove(id: number): Promise<void>;

  /**
   * Clear all cart items
   */
  clear(): Promise<void>;
}
