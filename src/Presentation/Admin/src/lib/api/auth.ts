/**
 * Auth API functions
 */

import { httpClient, setAuthToken, setRefreshToken, clearTokens } from '../httpClient'
import type {
    LoginCommand,
    AuthResponse,
    UserInfoResponse,
    ServiceResult,
    RefreshTokenCommand,
} from './types'

export const authApi = {
    login: async (command: LoginCommand): Promise<ServiceResult<AuthResponse>> => {
        const response = await httpClient.post<ServiceResult<AuthResponse>>(
            '/identity/login',
            command
        )
        return response.data
    },

    refreshToken: async (
        command: RefreshTokenCommand
    ): Promise<ServiceResult<AuthResponse>> => {
        const response = await httpClient.post<ServiceResult<AuthResponse>>(
            '/identity/refresh-token',
            command
        )
        return response.data
    },

    register: async (command: {
        email: string
        password: string
        firstName?: string
        lastName?: string
    }): Promise<ServiceResult<string>> => {
        const response = await httpClient.post<ServiceResult<string>>(
            '/identity/register',
            command
        )
        return response.data
    },

    getCurrentUser: async (): Promise<ServiceResult<UserInfoResponse>> => {
        const response = await httpClient.get<ServiceResult<UserInfoResponse>>(
            '/identity/me'
        )
        return response.data
    },

    updateMe: async (command: {
        firstName?: string
        lastName?: string
        gender?: string
    }): Promise<ServiceResult<UserInfoResponse>> => {
        const response = await httpClient.put<ServiceResult<UserInfoResponse>>(
            '/identity/me',
            command
        )
        return response.data
    },

    forgotPassword: async (email: string): Promise<ServiceResult<string>> => {
        const response = await httpClient.post<ServiceResult<string>>(
            '/identity/forgot-password',
            { email }
        )
        return response.data
    },

    resetPassword: async (command: {
        email: string
        token: string
        newPassword: string
    }): Promise<ServiceResult<string>> => {
        const response = await httpClient.post<ServiceResult<string>>(
            '/identity/reset-password',
            command
        )
        return response.data
    },

    logout: () => {
        clearTokens()
    },

    setTokens: (accessToken: string, refreshToken: string) => {
        setAuthToken(accessToken)
        setRefreshToken(refreshToken)
    },
}
