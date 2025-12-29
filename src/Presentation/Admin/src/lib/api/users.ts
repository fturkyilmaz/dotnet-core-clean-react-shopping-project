/**
 * Users API functions
 */

import { httpClient } from '../httpClient'
import type { UserInfoResponse, ServiceResult } from './types'

export const usersApi = {
    getAll: async (): Promise<ServiceResult<UserInfoResponse[]>> => {
        const response = await httpClient.get<ServiceResult<UserInfoResponse[]>>('/identity/users')
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
