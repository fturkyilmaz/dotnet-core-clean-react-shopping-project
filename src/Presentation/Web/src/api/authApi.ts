import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  statusCode: number;
  location: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post<ApiResponse<AuthData>>(`${API_URL}/identity/Login`, credentials);
    if (!response.data.isSuccess) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    const response = await axios.post<ApiResponse<any>>(`${API_URL}/identity/Register`, data);
    if (!response.data.isSuccess) {
      throw new Error(response.data.message || 'Registration failed');
    }
  },

  logout: async (): Promise<void> => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};
