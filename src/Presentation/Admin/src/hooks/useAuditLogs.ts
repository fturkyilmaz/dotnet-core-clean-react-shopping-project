/**
 * Audit Logs Hooks - React Query hooks for audit logs
 *
 * Provides consistent caching and error handling for audit log queries.
 */

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { auditLogsApi } from '@/lib/api/auditLogs'

/**
 * Cache configuration for audit logs
 * - 5 minute stale time (data stays fresh for 5 minutes)
 * - 10 minute garbage collection time
 * - 1 retry on failure
 * - No refetch on window focus (user initiated)
 */
const CACHE_CONFIG = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
} as const

export const auditLogKeys = {
    all: ['audit-logs'] as const,
    lists: () => [...auditLogKeys.all, 'list'] as const,
    list: (pageNumber: number, pageSize: number) =>
        [...auditLogKeys.lists(), { pageNumber, pageSize }] as const,
}

/**
 * Hook for fetching paginated audit logs
 *
 * @param pageNumber - Page number (1-indexed)
 * @param pageSize - Number of items per page
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useAuditLogs(1, 10)
 * ```
 */
export function useAuditLogs(pageNumber = 1, pageSize = 10) {
    return useQuery({
        queryKey: auditLogKeys.list(pageNumber, pageSize),
        queryFn: async () => {
            const result = await auditLogsApi.getAll(pageNumber, pageSize)
            if (!result.isSuccess) {
                const errorMessage = result.message || 'Failed to fetch audit logs'
                toast.error(errorMessage)
                throw new Error(errorMessage)
            }
            return result.data
        },
        ...CACHE_CONFIG,
        throwOnError: false,
    })
}
