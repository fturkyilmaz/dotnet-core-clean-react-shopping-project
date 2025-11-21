import { apiClient } from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  succeeded: boolean;
  data?: string; // JWT token
  errors?: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/Identity/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/Identity/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Clear local storage
    localStorage.removeItem('token');
  },
};
