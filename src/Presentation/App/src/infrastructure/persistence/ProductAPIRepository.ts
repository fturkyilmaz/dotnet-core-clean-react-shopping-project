import httpClient from '../api/httpClient';
import { IProductRepository } from '../../core/domain/ports/IProductRepository';
import { Product } from '../../core/domain/entities/Product';

export class ProductAPIRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    const response = await httpClient.get('/Products');
    return response.data.data || [];
  }

  async getById(id: number): Promise<Product | null> {
    try {
      const response = await httpClient.get(`/Products/${id}`);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async search(query: string): Promise<Product[]> {
    const response = await httpClient.post('/Products/search', {
      filter: {
        field: 'title',
        operator: 'contains',
        value: query,
      },
    });
    return response.data.data.items || [];
  }

  async getByCategory(category: string): Promise<Product[]> {
    const response = await httpClient.post('/Products/search', {
      filter: {
        field: 'category',
        operator: 'eq',
        value: category,
      },
    });
    return response.data.data.items || [];
  }
}
