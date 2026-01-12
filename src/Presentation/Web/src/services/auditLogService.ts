import { httpClient } from '../infrastructure/api/httpClient';
import { AuditLog, PaginatedList, ServiceResult } from '../types';

export const auditLogService = {
    getAuditLogs: async (pageNumber: number = 1, pageSize: number = 10): Promise<ServiceResult<PaginatedList<AuditLog>>> => {
        const response = await httpClient.get<ServiceResult<PaginatedList<AuditLog>>>(`/auditlogs`, {
            params: { pageNumber, pageSize },
        });
        return response.data;
    },
};
