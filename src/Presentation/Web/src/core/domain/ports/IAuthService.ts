/**
 * Auth Service Port
 * Interface that must be implemented by infrastructure layer
 */

import type { User } from '../entities/User';

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Authentication result
 */
export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Port for authentication operations
 * Must be implemented in infrastructure layer
 */
export interface IAuthService {
  /**
   * Login user
   */
  login(credentials: LoginCredentials): Promise<AuthResult>;

  /**
   * Register new user
   */
  register(data: RegisterData): Promise<AuthResult>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Get current user info
   */
  getCurrentUser(): Promise<User>;

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Promise<AuthResult>;
}
