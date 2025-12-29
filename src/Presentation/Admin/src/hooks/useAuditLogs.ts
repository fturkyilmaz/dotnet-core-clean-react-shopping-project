/**
 * Audit Logs Hooks - React Query hooks for audit logs
 */

import { useQuery } from '@tanstack/react-query'
import { auditLogsApi } from '@/lib/api/auditLogs'

export const auditLogKeys = {
    all: ['audit-logs'] as const,
    lists: () => [...auditLogKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
        [...auditLogKeys.lists(), filters] as const,
}

export function useAuditLogs(pageNumber = 1, pageSize = 10) {
    return useQuery({
        queryKey: auditLogKeys.list({ pageNumber, pageSize }),
        queryFn: async () => {
            const result = await auditLogsApi.getAll(pageNumber, pageSize)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to fetch audit logs')
            }
            return result.data
        },
    })
}
