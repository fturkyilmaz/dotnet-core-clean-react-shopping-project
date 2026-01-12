/**
 * Carts API functions
 */

import { httpClient } from '../httpClient'
import type {
    CartDto,
    CreateCartCommand,
    UpdateCartCommand,
    ServiceResult,
} from './types'

export const cartsApi = {
    getAll: async (): Promise<ServiceResult<CartDto[]>> => {
        const response = await httpClient.get<ServiceResult<CartDto[]>>('/carts')
        return response.data
    },

    getById: async (id: number): Promise<ServiceResult<CartDto>> => {
        const response = await httpClient.get<ServiceResult<CartDto>>(`/carts/${id}`)
        return response.data
    },

    create: async (command: CreateCartCommand): Promise<ServiceResult<number>> => {
        const response = await httpClient.post<ServiceResult<number>>('/carts', command)
        return response.data
    },

    update: async (
        id: number,
        command: UpdateCartCommand
    ): Promise<ServiceResult<boolean>> => {
        const response = await httpClient.put<ServiceResult<boolean>>(
            `/carts/${id}`,
            command
        )
        return response.data
    },

    delete: async (id: number): Promise<ServiceResult<boolean>> => {
        const response = await httpClient.delete<ServiceResult<boolean>>(`/carts/${id}`)
        return response.data
    },

    deleteAll: async (): Promise<ServiceResult<boolean>> => {
        const response = await httpClient.delete<ServiceResult<boolean>>('/carts/delete-all')
        return response.data
    },
}
