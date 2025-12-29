/**
 * Auth Hooks - React Query hooks for authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'
import type { LoginCommand } from '@/lib/api/types'
import { useAuthStore } from '@/stores/auth-store'

export const authKeys = {
    all: ['auth'] as const,
    currentUser: () => [...authKeys.all, 'currentUser'] as const,
}

export function useLogin() {
    const { auth } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (command: LoginCommand) => {
            const result = await authApi.login(command)
            if (!result.isSuccess || !result.data) {
                throw new Error(result.message || 'Login failed')
            }
            return result.data
        },
        onSuccess: (data, variables) => {
            // Store tokens
            if (data.accessToken && data.refreshToken) {
                authApi.setTokens(data.accessToken, data.refreshToken)
                auth.setAccessToken(data.accessToken)
                auth.setRefreshToken(data.refreshToken)
            }

            // Set a temporary user until we fetch the real one
            auth.setUser({
                accountNo: '',
                email: variables.email,
                role: [],
                exp: Date.now() + 24 * 60 * 60 * 1000,
            })

            // Invalidate and refetch current user
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Login failed. Please check your credentials.')
        },
    })
}

export function useLogout() {
    const navigate = useNavigate()
    const { auth } = useAuthStore()
    const queryClient = useQueryClient()

    return () => {
        authApi.logout()
        auth.reset()
        queryClient.clear()
        navigate({ to: '/sign-in', replace: true })
        toast.success('Logged out successfully')
    }
}

export function useRegister() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (command: { email: string; password: string; firstName?: string; lastName?: string }) => {
            const result = await authApi.register(command)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Registration failed')
            }
            return result.data
        },
        onSuccess: () => {
            toast.success('Account created successfully! Please sign in.')
            navigate({ to: '/sign-in', replace: true })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Registration failed. Please try again.')
        },
    })
}

export function useCurrentUser(enabled = true) {
    const { auth } = useAuthStore()

    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: async () => {
            const result = await authApi.getCurrentUser()
            if (!result.isSuccess || !result.data) {
                throw new Error(result.message || 'Failed to fetch user info')
            }
            return result.data
        },
        enabled: enabled && !!auth.accessToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    })
}

export function useUpdateMe() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (command: { firstName?: string; lastName?: string; gender?: string }) => {
            const result = await authApi.updateMe(command)
            if (!result.isSuccess || !result.data) {
                throw new Error(result.message || 'Failed to update profile')
            }
            return result.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
            toast.success('Profile updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update profile')
        },
    })
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: async (email: string) => {
            const result = await authApi.forgotPassword(email)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to send reset email')
            }
            return result.data
        },
        onSuccess: () => {
            toast.success('Password reset email sent. Please check your inbox.')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to send reset email')
        },
    })
}

export function useResetPassword() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (command: { email: string; token: string; newPassword: string }) => {
            const result = await authApi.resetPassword(command)
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to reset password')
            }
            return result.data
        },
        onSuccess: () => {
            toast.success('Password reset successfully. Please sign in.')
            navigate({ to: '/sign-in', replace: true })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to reset password')
        },
    })
}
