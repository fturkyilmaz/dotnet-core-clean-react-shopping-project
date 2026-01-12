/**
 * Users Hooks - React Query hooks for user management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi } from '@/lib/api/users'

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
        [...userKeys.lists(), filters] as const,
}

export function useUsers(pageNumber = 1, pageSize = 10) {
    return useQuery({
        queryKey: userKeys.list({ pageNumber, pageSize }),
        queryFn: async () => {
            const result = await usersApi.getAll(pageNumber, pageSize)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to fetch users')
            }
            return result.data
        },
    })
}

export function useAssignAdminRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId: string) => {
            const result = await usersApi.assignAdminRole(userId)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to assign admin role')
            }
            return result.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            toast.success('Admin role assigned successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to assign admin role')
        },
    })
}

export function useCreateRole() {
    return useMutation({
        mutationFn: async (roleName: string) => {
            const result = await usersApi.createRole(roleName)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to create role')
            }
            return result.data
        },
        onSuccess: () => {
            toast.success('Role created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create role')
        },
    })
}
