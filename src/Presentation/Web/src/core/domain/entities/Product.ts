/**
 * Product entity - Core domain model
 * Represents a product in the e-commerce system
 */

export interface ProductRating {
  rate: number;
  count: number;
}

export type ProductCategory = 
  | 'electronics'
  | 'jewelery'
  | "men's clothing"
  | "women's clothing"
  | 'all';

/**
 * Product domain entity
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

/**
 * Value object for product creation
 */
export type CreateProduct = Omit<Product, 'id' | 'rating'>;

/**
 * Value object for product update
 */
export type UpdateProduct = Partial<Omit<Product, 'id'>> & { id: number };
