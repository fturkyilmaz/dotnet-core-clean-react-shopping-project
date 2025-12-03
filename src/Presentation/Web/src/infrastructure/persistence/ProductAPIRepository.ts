/**
 * Product API Repository - Infrastructure Implementation
 * Implements IProductRepository using HTTP API calls
 */

import type { IProductRepository, ProductSearchParams, ProductsResult } from '@/core/domain/ports/IProductRepository';
import type { Product, CreateProduct, UpdateProduct } from '@/core/domain/entities/Product';
import { httpClient } from '../api/httpClient';
import type { ServiceResult } from '../api/dtos/common';

export class ProductAPIRepository implements IProductRepository {
  private readonly basePath = '/Products';

  async getAll(): Promise<Product[]> {
    const response = await httpClient.get<ServiceResult<Product[]>>(this.basePath);
    return response.data.data || [];
  }

  async getById(id: number): Promise<Product> {
    const response = await httpClient.get<ServiceResult<Product>>(`${this.basePath}/${id}`);
    if (!response.data.data) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return response.data.data;
  }

  async search(params: ProductSearchParams): Promise<ProductsResult> {
    const { query, category, minPrice, maxPrice, sortBy, sortOrder } = params;
    
    const filters: any[] = [];
    if (query) {
      filters.push({ field: 'title', operator: 'contains', value: query });
    }
    if (category && category !== 'all') {
      filters.push({ field: 'category', operator: 'equals', value: category });
    }
    if (minPrice !== undefined) {
      filters.push({ field: 'price', operator: 'greaterThanOrEqual', value: minPrice });
    }
    if (maxPrice !== undefined) {
      filters.push({ field: 'price', operator: 'lessThanOrEqual', value: maxPrice });
    }

    const response = await httpClient.post<ServiceResult<ProductsResult>>(
      `${this.basePath}/search?index=0&size=100`,
      {
        filters,
        sorts: sortBy ? [{ field: sortBy, dir: sortOrder || 'asc' }] : [],
      }
    );

    return response.data.data || { items: [], totalCount: 0, pageIndex: 0, pageSize: 100 };
  }

  async create(product: CreateProduct): Promise<Product> {
    const response = await httpClient.post<ServiceResult<number>>(this.basePath, product);
    const id = response.data.data;
    if (!id) {
      throw new Error('Failed to create product');
    }
    // Fetch the created product
    return this.getById(id);
  }

  async update(product: UpdateProduct): Promise<Product> {
    await httpClient.put<ServiceResult<void>>(`${this.basePath}/${product.id}`, product);
    return this.getById(product.id);
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete<ServiceResult<void>>(`${this.basePath}/${id}`);
  }
}
