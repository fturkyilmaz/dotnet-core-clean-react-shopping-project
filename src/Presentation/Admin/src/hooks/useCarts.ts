/**
 * Carts Hooks - React Query hooks for carts management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cartsApi } from '@/lib/api/carts'
import type { CartDto, CreateCartCommand, UpdateCartCommand, PaginatedList } from '@/lib/api/types'

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 10

export const cartKeys = {
    all: ['carts'] as const,
    lists: () => [...cartKeys.all, 'list'] as const,
    details: () => [...cartKeys.all, 'detail'] as const,
    detail: (id: number) => [...cartKeys.details(), id] as const,
    paged: (pageNumber: number, pageSize: number) =>
        [...cartKeys.all, 'paged', { pageNumber, pageSize }] as const,
}

export function useCarts() {
    return useQuery({
        queryKey: cartKeys.lists(),
        queryFn: async () => {
            const result = await cartsApi.getAll()
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to fetch carts')
            }
            return result.data || []
        },
    })
}

/**
 * Paginated carts hook - fetches all carts and handles pagination on the client side
 */
export function useCartsPaged(pageNumber: number, pageSize: number = DEFAULT_PAGE_SIZE) {
    return useQuery({
        queryKey: cartKeys.paged(pageNumber, pageSize),
        queryFn: async () => {
            const result = await cartsApi.getAll()
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to fetch carts')
            }

            const allCarts = result.data || []
            const totalCount = allCarts.length
            const totalPages = Math.ceil(totalCount / pageSize)
            const startIndex = (pageNumber - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedData = allCarts.slice(startIndex, endIndex)

            const paginatedList: PaginatedList<CartDto> = {
                items: paginatedData,
                totalCount,
                pageNumber,
                totalPages,
                hasPreviousPage: pageNumber > 1,
                hasNextPage: pageNumber < totalPages,
            }

            return paginatedList
        },
    })
}

export function useCart(id: number) {
    return useQuery({
        queryKey: cartKeys.detail(id),
        queryFn: async () => {
            const result = await cartsApi.getById(id)
            if (!result.isSuccess || !result.data) {
                throw new Error(result.message || 'Cart not found')
            }
            return result.data
        },
        enabled: !!id,
    })
}

export function useCreateCart() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (command: CreateCartCommand) => {
            const result = await cartsApi.create(command)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to create cart')
            }
            return result.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
            toast.success('Cart created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create cart')
        },
    })
}

export function useUpdateCart() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            command,
        }: {
            id: number
            command: UpdateCartCommand
        }) => {
            const result = await cartsApi.update(id, command)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to update cart')
            }
            return result.data
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
            queryClient.invalidateQueries({ queryKey: cartKeys.detail(id) })
            toast.success('Cart updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update cart')
        },
    })
}

export function useDeleteCart() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            const result = await cartsApi.delete(id)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to delete cart')
            }
            return result.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
            toast.success('Cart deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete cart')
        },
    })
}

export function useDeleteAllCarts() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const result = await cartsApi.deleteAll()
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to delete all carts')
            }
            return result.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
            toast.success('All carts deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete all carts')
        },
    })
}
