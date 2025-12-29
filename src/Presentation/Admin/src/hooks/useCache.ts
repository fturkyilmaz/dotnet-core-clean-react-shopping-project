/**
 * Cache Hooks - React Query hooks for cache management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cacheApi } from '@/lib/api/cache'
import type { RedisCacheRequest } from '@/lib/api/types'

export const cacheKeys = {
    all: ['cache'] as const,
    detail: (key: string) => [...cacheKeys.all, key] as const,
}

export function useCacheValue(key: string, enabled = true) {
    return useQuery({
        queryKey: cacheKeys.detail(key),
        queryFn: async () => {
            const result = await cacheApi.get(key)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Cache key not found')
            }
            return result.data
        },
        enabled: enabled && !!key,
        retry: false,
    })
}

export function useSetCache() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: RedisCacheRequest) => {
            const result = await cacheApi.set(request)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to set cache')
            }
            return result.data
        },
        onSuccess: (_, { key }) => {
            queryClient.invalidateQueries({ queryKey: cacheKeys.detail(key) })
            toast.success('Cache value set successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to set cache')
        },
    })
}

export function useDeleteCache() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (key: string) => {
            const result = await cacheApi.delete(key)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to delete cache')
            }
            return result.data
        },
        onSuccess: (_, key) => {
            queryClient.invalidateQueries({ queryKey: cacheKeys.detail(key) })
            toast.success('Cache key deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete cache')
        },
    })
}
