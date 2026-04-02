/**
 * Auth API Service - Infrastructure Implementation
 * Uses HttpOnly cookies for authentication
 */

import type { IAuthService, LoginCredentials, RegisterData, AuthResult } from '@/core/domain/ports/IAuthService';
import type { User } from '@/core/domain/entities/User';
import { httpClient, authService, clearCsrfToken } from '../api/httpClient';
import type { ServiceResult } from '../api/dtos/common';

// Backend response type for user info
interface UserInfoResponse extends User {
  username: string;
}

export class AuthAPIService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await httpClient.post<ServiceResult<AuthResult>>(
      '/identity/login',
      credentials
    );

    const authResult = response.data.data;
    if (!authResult) {
      throw new Error('Login failed');
    }

    return authResult;
  }

  async register(data: RegisterData): Promise<AuthResult> {
    const response = await httpClient.post<ServiceResult<string>>('/identity/register', data);
    
    if (!response.data.succeeded) {
      throw new Error(response.data.errors?.join(', ') || 'Registration failed');
    }

    return this.login({
      email: data.email,
      password: data.password,
    });
  }

  async logout(): Promise<void> {
    try {
      await authService.logout();
    } finally {
      clearCsrfToken();
      window.location.href = '/login';
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<ServiceResult<UserInfoResponse>>('/identity/me');
    const userInfo = response.data.data;
    if (!userInfo) {
      throw new Error('Failed to get user info');
    }
    
    const { username, ...user } = userInfo;
    return user;
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    await authService.checkAuth();
    return { accessToken: 'cookie-based', refreshToken: 'cookie-based' };
  }
}
