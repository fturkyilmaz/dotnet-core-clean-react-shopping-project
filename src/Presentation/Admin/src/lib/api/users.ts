/**
 * Users API functions
 */

import { httpClient } from '../httpClient'
import type { UserInfoResponse, ServiceResult, PaginatedList } from './types'

export const usersApi = {
    getAll: async (
        pageNumber = 1,
        pageSize = 10
    ): Promise<ServiceResult<PaginatedList<UserInfoResponse>>> => {
        const response = await httpClient.get<ServiceResult<PaginatedList<UserInfoResponse>>>('/identity/users', {
            params: { pageNumber, pageSize }
        })
        return response.data
    },

    assignAdminRole: async (userId: string): Promise<ServiceResult<string>> => {
        const response = await httpClient.post<ServiceResult<string>>(
            `/identity/${userId}/assign-admin-role`
        )
        return response.data
    },

    createRole: async (roleName: string): Promise<ServiceResult<string>> => {
        const response = await httpClient.post<ServiceResult<string>>(
            `/identity/roles/${roleName}`
        )
        return response.data
    },
}
