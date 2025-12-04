import { Product } from '../entities/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  search(query: string): Promise<Product[]>;
  getByCategory(category: string): Promise<Product[]>;
}
