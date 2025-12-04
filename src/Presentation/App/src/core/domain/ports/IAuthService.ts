import { LoginRequest, AuthResponse } from '../entities/Auth';
import { User } from '../entities/User';

export interface IAuthService {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthResponse>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;
}
