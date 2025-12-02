import { apiClient } from '@api/axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import { ServiceResult, UserInfoResponse } from '@/types';

// Re-export types for backward compatibility
export type { LoginRequest, RegisterRequest, AuthResponse };

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ServiceResult<AuthResponse>>('/identity/login', credentials);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const response = await apiClient.post<ServiceResult<string>>('/identity/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    // Client-side logout only as backend is stateless JWT
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },

  refreshToken: async (accessToken: string, refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ServiceResult<AuthResponse>>('/identity/refresh-token', { 
      accessToken, 
      refreshToken 
    });
    return response.data.data;
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get<ServiceResult<UserInfoResponse>>('/identity/me');
    return response.data.data;
  },
};

