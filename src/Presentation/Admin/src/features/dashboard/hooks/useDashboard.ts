import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'
import type { DashboardData, DashboardStats, SalesData, RecentSale } from '@/lib/api/types'

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const result = await dashboardApi.getDashboardData()
      if (!result.isSuccess || !result.data) {
        throw new Error(result.message || 'Failed to fetch dashboard data')
      }
      return result.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const result = await dashboardApi.getStats()
      if (!result.isSuccess || !result.data) {
        throw new Error(result.message || 'Failed to fetch dashboard stats')
      }
      return result.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useSalesData() {
  return useQuery<SalesData[]>({
    queryKey: ['dashboard', 'sales'],
    queryFn: async (): Promise<SalesData[]> => {
      const result = await dashboardApi.getSalesData()
      if (!result.isSuccess || !result.data) {
        throw new Error(result.message || 'Failed to fetch sales data')
      }
      return result.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useRecentSales(limit = 5) {
  return useQuery<RecentSale[]>({
    queryKey: ['dashboard', 'recent-sales', limit],
    queryFn: async (): Promise<RecentSale[]> => {
      const result = await dashboardApi.getRecentSales(limit)
      if (!result.isSuccess || !result.data) {
        throw new Error(result.message || 'Failed to fetch recent sales')
      }
      return result.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
