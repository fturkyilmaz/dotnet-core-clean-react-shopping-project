/**
 * Cart entity - Core domain model
 * Represents a shopping cart and its items
 */

/**
 * Cart item domain entity
 */
export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * Shopping cart aggregate root
 */
export interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

/**
 * Value object for adding item to cart
 */
export interface AddCartItem {
  title: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * Value object for updating cart item
 */
export interface UpdateCartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * Cart totals calculation
 */
export interface CartTotals {
  subtotal: number;
  total: number;
  itemCount: number;
}
