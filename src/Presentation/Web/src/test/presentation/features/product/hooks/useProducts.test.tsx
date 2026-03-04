import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts } from '@/presentation/features/product/hooks/useProducts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import axios from 'axios';

// Mock axios
vi.mock('axios');

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
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch products successfully', async () => {
        // Arrange
        const mockProducts = [
            { id: 1, title: 'Product 1', price: 100, category: 'cat1', image: 'img1', rating: { rate: 4, count: 10 } }
        ];
        const mockResponse = {
            data: {
                data: mockProducts,
                isSuccess: true,
            },
        };
        (axios.get as any).mockResolvedValue(mockResponse);

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
        expect(axios.get).toHaveBeenCalledWith('/api/v1/Products', expect.any(Object));
    });

    it('should handle errors', async () => {
        // Arrange
        const error = new Error('Failed to fetch');
        (axios.get as any).mockRejectedValue(error);

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
