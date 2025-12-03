import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useProducts } from '@/presentation/features/product/hooks/useProducts';
import { productRepository } from '@/services/dependencyInjector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock dependency injector
vi.mock('@/services/dependencyInjector', () => ({
    productRepository: {
        getAll: vi.fn(),
    },
}));

// Setup QueryClient wrapper
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useProducts Hook', () => {
    it('should fetch products successfully', async () => {
        // Arrange
        const mockProducts = [
            { id: 1, title: 'Product 1', price: 100, category: 'cat1', image: 'img1', rating: { rate: 4, count: 10 } }
        ];
        (productRepository.getAll as any).mockResolvedValue(mockProducts);

        // Act
        const { result } = renderHook(() => useProducts(), {
            wrapper: createWrapper(),
        });

        // Assert - Loading state
        expect(result.current.isLoading).toBe(true);

        // Wait for data
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        // Assert - Data
        expect(result.current.data).toEqual(mockProducts);
        expect(productRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        // Arrange
        const error = new Error('Failed to fetch');
        (productRepository.getAll as any).mockRejectedValue(error);

        // Act
        const { result } = renderHook(() => useProducts(), {
            wrapper: createWrapper(),
        });

        // Wait for error
        await waitFor(() => expect(result.current.isError).toBe(true));

        // Assert
        expect(result.current.error).toBeDefined();
    });
});
