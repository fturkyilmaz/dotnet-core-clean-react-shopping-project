/**
 * Shopping cart type definitions
 */

import type { BaseEntity } from './common';

// ============================================================================
// Cart Item Types
// ============================================================================

/**
 * Item in the shopping cart (matches backend CartDto)
 */
export interface CartItem extends BaseEntity {
  title: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * Cart item creation DTO (matches CreateCartCommand)
 */
export interface CreateCartDto {
  title: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * Cart item update DTO (matches UpdateCartCommand)
 */
export interface UpdateCartDto {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

// ============================================================================
// Cart State Types
// ============================================================================

/**
 * Cart totals calculation
 */
export interface CartTotals {
  subtotal: number;
  total: number;
  itemCount: number;
}

