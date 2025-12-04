export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
