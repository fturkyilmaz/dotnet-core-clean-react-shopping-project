/**
 * Product-related type definitions
 */

import type { BaseEntity } from './common';

// ============================================================================
// Product Types
// ============================================================================

/**
 * Product rating information
 */
export interface ProductRating {
  rate: number;
  count: number;
}

/**
 * Product category
 */
export type ProductCategory = 
  | 'electronics'
  | 'jewelery'
  | "men's clothing"
  | "women's clothing"
  | 'all';

/**
 * Product entity
 */
export interface Product extends BaseEntity {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

/**
 * Product creation DTO (without ID)
 */
export type CreateProductDto = Omit<Product, 'id'>;

/**
 * Product update DTO (partial with required ID)
 */
export type UpdateProductDto = Partial<Omit<Product, 'id'>> & { id: number };

// ============================================================================
// Product Filter Types
// ============================================================================

/**
 * Product filter options
 */
export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: ProductSortOption;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product sort options
 */
export type ProductSortOption = 'price' | 'rating' | 'title' | 'newest';

/**
 * Product search parameters
 */
export interface ProductSearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  filters?: ProductFilters;
}

// ============================================================================
// Product Response Types
// ============================================================================

/**
 * Paginated products response
 */
export interface ProductsResponse {
  items: Product[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

/**
 * Product statistics
 */
export interface ProductStats {
  totalProducts: number;
  averagePrice: number;
  averageRating: number;
  categoryCounts: Record<string, number>;
}
