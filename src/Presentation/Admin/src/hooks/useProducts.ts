/**
 * Products Hooks - React Query hooks for products management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productsApi } from '@/lib/api/products'
import type { CreateProductCommand, UpdateProductCommand } from '@/lib/api/types'

export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
        [...productKeys.lists(), filters] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,
}

export function useProducts() {
    return useQuery({
        queryKey: productKeys.lists(),
        queryFn: async () => {
            const result = await productsApi.getAll()
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to fetch products')
            }
            return result.data || []
        },
    })
}

export function useProductsPaged(pageNumber = 1, pageSize = 10) {
    return useQuery({
        queryKey: productKeys.list({ pageNumber, pageSize }),
        queryFn: async () => {
            const result = await productsApi.getPaged(pageNumber, pageSize)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to fetch products')
            }
            return result.data
        },
    })
}

export function useProduct(id: number) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
            const result = await productsApi.getById(id)
            if (!result.isSuccess || !result.data) {
                throw new Error(result.message || 'Product not found')
            }
            return result.data
        },
        enabled: !!id,
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (command: CreateProductCommand) => {
            const result = await productsApi.create(command)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to create product')
            }
            return result.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() })
            toast.success('Product created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create product')
        },
    })
}

export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            command,
        }: {
            id: number
            command: UpdateProductCommand
        }) => {
            const result = await productsApi.update(id, command)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to update product')
            }
            return result.data
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() })
            queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
            toast.success('Product updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update product')
        },
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            const result = await productsApi.delete(id)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to delete product')
            }
            return result.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() })
            toast.success('Product deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete product')
        },
    })
}
