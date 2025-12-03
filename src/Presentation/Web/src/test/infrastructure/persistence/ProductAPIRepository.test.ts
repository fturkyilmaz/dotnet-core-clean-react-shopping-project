import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductAPIRepository } from '@/infrastructure/persistence/ProductAPIRepository';
import { httpClient } from '@/infrastructure/api/httpClient';
import type { Product } from '@/core/domain/entities/Product';

// Mock httpClient
vi.mock('@/infrastructure/api/httpClient', () => ({
    httpClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('ProductAPIRepository', () => {
    let repository: ProductAPIRepository;
    const mockProducts: Product[] = [
        {
            id: 1,
            title: 'Test Product',
            price: 100,
            description: 'Test Description',
            category: 'electronics',
            image: 'test.jpg',
            rating: { rate: 4.5, count: 10 }
        }
    ];

    beforeEach(() => {
        repository = new ProductAPIRepository();
        vi.clearAllMocks();
    });

    it('getAll should fetch products from API', async () => {
        // Arrange
        (httpClient.get as any).mockResolvedValue({ data: { items: mockProducts } });

        // Act
        const result = await repository.getAll();

        // Assert
        expect(httpClient.get).toHaveBeenCalledWith('/api/v1/Products');
        expect(result).toEqual(mockProducts);
    });

    it('getById should fetch a single product', async () => {
        // Arrange
        const mockProduct = mockProducts[0];
        (httpClient.get as any).mockResolvedValue({ data: mockProduct });

        // Act
        const result = await repository.getById(1);

        // Assert
        expect(httpClient.get).toHaveBeenCalledWith('/api/v1/Products/1');
        expect(result).toEqual(mockProduct);
    });

    it('create should post new product', async () => {
        // Arrange
        const newProduct = { title: 'New Product', price: 50, description: 'Desc', category: 'cat', image: 'img' };
        const createdProduct = { ...newProduct, id: 2 };
        (httpClient.post as any).mockResolvedValue({ data: createdProduct });

        // Act
        const result = await repository.create(newProduct as any);

        // Assert
        expect(httpClient.post).toHaveBeenCalledWith('/api/v1/Products', newProduct);
        expect(result).toEqual(createdProduct);
    });
});
