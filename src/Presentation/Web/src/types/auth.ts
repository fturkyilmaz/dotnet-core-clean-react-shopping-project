/**
 * Authentication-related type definitions
 */

// ============================================================================
// Auth Request Types
// ============================================================================

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================================
// Auth Response Types
// ============================================================================

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

/**
 * Token payload
 */
export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

// ============================================================================
// User Types
// ============================================================================

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  isEmailVerified: boolean;
}

/**
 * User profile
 */
export interface UserProfile extends User {
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Auth State Types
// ============================================================================

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth error
 */
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}
