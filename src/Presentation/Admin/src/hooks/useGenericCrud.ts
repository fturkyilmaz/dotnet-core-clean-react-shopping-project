/**
 * Generic CRUD Hook Factory
 *
 * Provides reusable hooks for CRUD operations with:
 * - Server-side pagination support
 * - Consistent error handling with toast notifications
 * - Configurable caching
 * - Type-safe queries
 *
 * @example
 * ```typescript
 * const { useList, useGetById, useCreate, useUpdate, useDelete } = createCrudHooks({
 *   resourceName: 'products',
 *   api: {
 *     getAll: () => productsApi.getAll(),
 *     getPaged: (pageNumber, pageSize) => productsApi.getPaged(pageNumber, pageSize),
 *     getById: (id) => productsApi.getById(id),
 *     create: (data) => productsApi.create(data),
 *     update: ({ id, data }) => productsApi.update(id, data),
 *     delete: (id) => productsApi.delete(id),
 *   },
 *   cacheConfig: {
 *     staleTime: 1000 * 60 * 5,
 *     gcTime: 1000 * 60 * 10,
 *   },
 * });
 * ```
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ServiceResult, PaginatedList } from '../lib/api/types'

// Default cache configuration
export const DEFAULT_CACHE_CONFIG = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
} as const

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10

// Type definitions
export interface CacheConfig {
    staleTime?: number
    gcTime?: number
    retry?: number
    refetchOnWindowFocus?: boolean
}

export interface CRUDApi<TItem, TCreateData = unknown, TUpdateData = unknown> {
    getAll: () => Promise<ServiceResult<TItem[]>>
    getPaged?: (pageNumber: number, pageSize: number) => Promise<ServiceResult<PaginatedList<TItem>>>
    getById: (id: number) => Promise<ServiceResult<TItem>>
    create: (data: TCreateData) => Promise<ServiceResult<TItem>>
    update: (params: { id: number; data: TUpdateData }) => Promise<ServiceResult<TItem>>
    delete: (id: number) => Promise<ServiceResult<void>>
}

export interface CreateCrudHooksOptions<TItem, TCreateData, TUpdateData> {
    resourceName: string
    api: CRUDApi<TItem, TCreateData, TUpdateData>
    cacheConfig?: CacheConfig
    messages?: {
        createSuccess?: string
        createError?: string
        updateSuccess?: string
        updateError?: string
        deleteSuccess?: string
        deleteError?: string
        fetchError?: string
        notFound?: string
    }
}

interface QueryKeys {
    all: readonly [string]
    lists: () => readonly [string, string]
    details: () => readonly [string, string]
    detail: (id: number) => readonly [string, string, number]
    paged: (pageNumber: number, pageSize: number) => readonly [string, string, number, number]
}

export function createCrudHooks<
    TItem,
    TCreateData = unknown,
    TUpdateData = unknown
>({
    resourceName,
    api,
    cacheConfig = {},
    messages = {},
}: CreateCrudHooksOptions<TItem, TCreateData, TUpdateData>) {
    const config = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig }

    const msg = {
        createSuccess: messages.createSuccess || `${resourceName} created successfully`,
        createError: messages.createError || `Failed to create ${resourceName}`,
        updateSuccess: messages.updateSuccess || `${resourceName} updated successfully`,
        updateError: messages.updateError || `Failed to update ${resourceName}`,
        deleteSuccess: messages.deleteSuccess || `${resourceName} deleted successfully`,
        deleteError: messages.deleteError || `Failed to delete ${resourceName}`,
        fetchError: messages.fetchError || `Failed to fetch ${resourceName}`,
        notFound: messages.notFound || `${resourceName} not found`,
    }

    const keys: QueryKeys = {
        all: [resourceName] as const,
        lists: () => [resourceName, 'list'] as const,
        details: () => [resourceName, 'detail'] as const,
        detail: (id: number) => [resourceName, 'detail', id] as const,
        paged: (pageNumber: number, pageSize: number) => [resourceName, 'paged', pageNumber, pageSize] as const,
    }

    const useList = () => {
        return useQuery<TItem[], Error>({
            queryKey: keys.lists(),
            queryFn: async () => {
                const result = await api.getAll()
                if (!result.isSuccess) {
                    throw new Error(result.message || msg.fetchError)
                }
                return result.data || []
            },
            staleTime: config.staleTime,
            gcTime: config.gcTime,
            retry: config.retry,
            refetchOnWindowFocus: config.refetchOnWindowFocus,
        })
    }

    const usePaged = (pageNumber: number = 1, pageSize: number = DEFAULT_PAGE_SIZE) => {
        const getPagedFn = api.getPaged
        if (!getPagedFn) {
            throw new Error(`getPaged is not implemented for ${resourceName}`)
        }

        return useQuery<PaginatedList<TItem>, Error>({
            queryKey: keys.paged(pageNumber, pageSize),
            queryFn: async () => {
                const result = await getPagedFn(pageNumber, pageSize)
                if (!result.isSuccess) {
                    throw new Error(result.message || msg.fetchError)
                }
                return result.data!
            },
            staleTime: config.staleTime,
            gcTime: config.gcTime,
            retry: config.retry,
            refetchOnWindowFocus: config.refetchOnWindowFocus,
        })
    }

    const useGetById = (id: number) => {
        return useQuery<TItem, Error>({
            queryKey: keys.detail(id),
            queryFn: async () => {
                const result = await api.getById(id)
                if (!result.isSuccess || !result.data) {
                    throw new Error(result.message || msg.notFound)
                }
                return result.data
            },
            enabled: !!id,
            staleTime: config.staleTime,
            gcTime: config.gcTime,
            retry: config.retry,
            refetchOnWindowFocus: config.refetchOnWindowFocus,
        })
    }

    const useCreate = () => {
        const queryClient = useQueryClient()

        return useMutation<TItem, Error, TCreateData>({
            mutationFn: async (data: TCreateData) => {
                const result = await api.create(data)
                if (!result.isSuccess) {
                    throw new Error(result.message || msg.createError)
                }
                return result.data!
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: keys.lists() })
                queryClient.invalidateQueries({ queryKey: [resourceName, 'paged'] })
                toast.success(msg.createSuccess)
            },
            onError: (error: Error) => {
                toast.error(error.message || msg.createError)
            },
        })
    }

    const useUpdate = () => {
        const queryClient = useQueryClient()

        return useMutation<TItem, Error, { id: number; data: TUpdateData }>({
            mutationFn: async ({ id, data }) => {
                const result = await api.update({ id, data })
                if (!result.isSuccess) {
                    throw new Error(result.message || msg.updateError)
                }
                return result.data!
            },
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: keys.lists() })
                queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) })
                queryClient.invalidateQueries({ queryKey: [resourceName, 'paged'] })
                toast.success(msg.updateSuccess)
            },
            onError: (error: Error) => {
                toast.error(error.message || msg.updateError)
            },
        })
    }

    const useDelete = () => {
        const queryClient = useQueryClient()

        return useMutation<void, Error, number>({
            mutationFn: async (id: number) => {
                const result = await api.delete(id)
                if (!result.isSuccess) {
                    throw new Error(result.message || msg.deleteError)
                }
                return result.data!
            },
            onSuccess: (_, id) => {
                queryClient.invalidateQueries({ queryKey: keys.lists() })
                queryClient.invalidateQueries({ queryKey: keys.detail(id) })
                queryClient.invalidateQueries({ queryKey: [resourceName, 'paged'] })
                toast.success(msg.deleteSuccess)
            },
            onError: (error: Error) => {
                toast.error(error.message || msg.deleteError)
            },
        })
    }

    return {
        keys,
        useList,
        usePaged,
        useGetById,
        useCreate,
        useUpdate,
        useDelete,
    }
}

/**
 * Creates query keys for a resource
 */
export function createQueryKeys(resourceName: string): QueryKeys {
    return {
        all: [resourceName] as const,
        lists: () => [resourceName, 'list'] as const,
        details: () => [resourceName, 'detail'] as const,
        detail: (id: number) => [resourceName, 'detail', id] as const,
        paged: (pageNumber: number, pageSize: number) => [resourceName, 'paged', pageNumber, pageSize] as const,
    }
}

/**
 * Creates a standard cache config for a resource
 */
export function createCacheConfig(overrides?: Partial<CacheConfig>): CacheConfig {
    return {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
        ...overrides,
    }
}
