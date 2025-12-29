/**
 * Audit Logs API functions
 */

import { httpClient } from '../httpClient'
import type { AuditLogDto, ServiceResult, PaginatedList } from './types'

export const auditLogsApi = {
    getAll: async (
        pageNumber = 1,
        pageSize = 10
    ): Promise<ServiceResult<PaginatedList<AuditLogDto>>> => {
        const response = await httpClient.get<ServiceResult<PaginatedList<AuditLogDto>>>(
            '/auditlogs',
            { params: { pageNumber, pageSize } }
        )
        return response.data
    },
}
