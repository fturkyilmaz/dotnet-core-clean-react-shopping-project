import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authApi } from '@api/auth.api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import { setCredentials, logout as logoutAction } from '@store/slices/authSlice';
import { toast } from 'react-toastify';

interface UseAuthReturn {
  login: (credentials: LoginRequest) => void;
  register: (data: RegisterRequest) => void;
  logout: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      // Decode JWT to get user info (simple decode, not verification)
      const tokenParts = data.token.split('.');
      if (tokenParts.length === 3 && tokenParts[1]) {
        const payload = JSON.parse(atob(tokenParts[1]));
        dispatch(setCredentials({
          user: {
            id: payload.sub || payload.nameid,
            email: payload.email,
            roles: payload.role ? (Array.isArray(payload.role) ? payload.role : [payload.role]) : [],
          },
          token: data.token,
        }));
        toast.success('Login successful!');
      } else {
        toast.error('Invalid token format');
      }
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
    },
    onError: () => {
      toast.error('Registration failed');
    },
  });

  const logout = (): void => {
    authApi.logout();
    dispatch(logoutAction());
    toast.info('Logged out successfully');
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
