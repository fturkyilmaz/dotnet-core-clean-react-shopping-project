/**
 * Dashboard API functions
 * API endpoints for dashboard data
 */

import { httpClient } from '../httpClient'
import type {
    DashboardData,
    DashboardStats,
    SalesData,
    RecentSale,
    ServiceResult,
} from './types'

export const dashboardApi = {
    /**
     * Get all dashboard data in a single call
     */
    getDashboardData: async (): Promise<ServiceResult<DashboardData>> => {
        const response = await httpClient.get<ServiceResult<DashboardData>>('/dashboard')
        return response.data
    },

    /**
     * Get dashboard statistics only
     */
    getStats: async (): Promise<ServiceResult<DashboardStats>> => {
        const response = await httpClient.get<ServiceResult<DashboardStats>>('/dashboard/stats')
        return response.data
    },

    /**
     * Get sales data for charts
     */
    getSalesData: async (): Promise<ServiceResult<SalesData[]>> => {
        const response = await httpClient.get<ServiceResult<SalesData[]>>('/dashboard/sales')
        return response.data
    },

    /**
     * Get recent sales
     */
    getRecentSales: async (limit = 5): Promise<ServiceResult<RecentSale[]>> => {
        const response = await httpClient.get<ServiceResult<RecentSale[]>>('/dashboard/recent-sales', {
            params: { limit },
        })
        return response.data
    },
}
