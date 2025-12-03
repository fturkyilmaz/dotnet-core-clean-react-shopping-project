/**
 * Product Repository Port
 * Interface that must be implemented by infrastructure layer
 */

import type { Product, CreateProduct, UpdateProduct } from '../entities/Product';

/**
 * Product search parameters
 */
export interface ProductSearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated products result
 */
export interface ProductsResult {
  items: Product[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

/**
 * Port for product data access
 * Must be implemented in infrastructure layer
 */
export interface IProductRepository {
  /**
   * Get all products
   */
  getAll(): Promise<Product[]>;

  /**
   * Get product by ID
   */
  getById(id: number): Promise<Product>;

  /**
   * Search products with filters
   */
  search(params: ProductSearchParams): Promise<ProductsResult>;

  /**
   * Create new product
   */
  create(product: CreateProduct): Promise<Product>;

  /**
   * Update existing product
   */
  update(product: UpdateProduct): Promise<Product>;

  /**
   * Delete product
   */
  delete(id: number): Promise<void>;
}
