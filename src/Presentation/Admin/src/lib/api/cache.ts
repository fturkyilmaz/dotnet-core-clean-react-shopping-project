/**
 * Cache API functions
 */

import { httpClient } from '../httpClient'
import type { RedisCacheRequest, ServiceResult } from './types'

export const cacheApi = {
    get: async (key: string): Promise<ServiceResult<string>> => {
        const response = await httpClient.get<ServiceResult<string>>(`/cache/${key}`)
        return response.data
    },

    set: async (request: RedisCacheRequest): Promise<ServiceResult<boolean>> => {
        const response = await httpClient.post<ServiceResult<boolean>>(
            '/cache/set',
            request
        )
        return response.data
    },

    delete: async (key: string): Promise<ServiceResult<boolean>> => {
        const response = await httpClient.delete<ServiceResult<boolean>>(`/cache/${key}`)
        return response.data
    },
}
