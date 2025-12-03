/**
 * Cart API Repository - Infrastructure Implementation
 * Implements ICartRepository using HTTP API calls
 */

import type { ICartRepository } from '@/core/domain/ports/ICartRepository';
import type { CartItem, AddCartItem, UpdateCartItem } from '@/core/domain/entities/Cart';
import { httpClient } from '../api/httpClient';
import type { ServiceResult } from '../api/dtos/common';

export class CartAPIRepository implements ICartRepository {
  private readonly basePath = '/carts';

  async getAll(): Promise<CartItem[]> {
    const response = await httpClient.get<ServiceResult<CartItem[]>>(this.basePath);
    return response.data.data || [];
  }

  async getById(id: number): Promise<CartItem> {
    const items = await this.getAll();
    const item = items.find((i) => i.id === id);
    if (!item) {
      throw new Error(`Cart item with ID ${id} not found`);
    }
    return item;
  }

  async add(item: AddCartItem): Promise<CartItem> {
    const response = await httpClient.post<ServiceResult<number>>(this.basePath, item);
    const id = response.data.data;
    if (id === undefined) {
      throw new Error('Failed to add item to cart');
    }
    return { ...item, id };
  }

  async update(item: UpdateCartItem): Promise<CartItem> {
    await httpClient.put<ServiceResult<void>>(`${this.basePath}/${item.id}`, item);
    return item;
  }

  async remove(id: number): Promise<void> {
    await httpClient.delete<ServiceResult<void>>(`${this.basePath}/${id}`);
  }

  async clear(): Promise<void> {
    await httpClient.delete<ServiceResult<void>>(`${this.basePath}/delete-all`);
  }
}
