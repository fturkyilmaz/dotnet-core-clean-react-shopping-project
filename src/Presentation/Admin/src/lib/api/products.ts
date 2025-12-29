/**
 * Products API functions
 */

import { httpClient } from '../httpClient'
import type {
    ProductDto,
    CreateProductCommand,
    UpdateProductCommand,
    ServiceResult,
    PaginatedList,
    DynamicQuery,
    IPaginate,
} from './types'

export const productsApi = {
    getAll: async (): Promise<ServiceResult<ProductDto[]>> => {
        const response = await httpClient.get<ServiceResult<ProductDto[]>>('/products')
        return response.data
    },

    getPaged: async (
        pageNumber = 1,
        pageSize = 10
    ): Promise<ServiceResult<PaginatedList<ProductDto>>> => {
        const response = await httpClient.get<ServiceResult<PaginatedList<ProductDto>>>(
            '/products/paged',
            { params: { pageNumber, pageSize } }
        )
        return response.data
    },

    getById: async (id: number): Promise<ServiceResult<ProductDto>> => {
        const response = await httpClient.get<ServiceResult<ProductDto>>(`/products/${id}`)
        return response.data
    },

    create: async (command: CreateProductCommand): Promise<ServiceResult<number>> => {
        const response = await httpClient.post<ServiceResult<number>>('/products', command)
        return response.data
    },

    update: async (
        id: number,
        command: UpdateProductCommand
    ): Promise<ServiceResult<boolean>> => {
        const response = await httpClient.put<ServiceResult<boolean>>(
            `/products/${id}`,
            command
        )
        return response.data
    },

    delete: async (id: number): Promise<ServiceResult<boolean>> => {
        const response = await httpClient.delete<ServiceResult<boolean>>(`/products/${id}`)
        return response.data
    },

    search: async (
        dynamicQuery: DynamicQuery,
        index = 0,
        size = 10
    ): Promise<ServiceResult<IPaginate<ProductDto>>> => {
        const response = await httpClient.post<ServiceResult<IPaginate<ProductDto>>>(
            '/products/search',
            dynamicQuery,
            { params: { index, size } }
        )
        return response.data
    },
}
