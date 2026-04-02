/**
 * Auth Hooks - Using HttpOnly cookies for authentication
 * All API calls are now integrated with React Query
 */

import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  usePostApiV1IdentityLogin,
  usePostApiV1IdentityRegister,
  useGetApiV1IdentityMe,
} from '@/infrastructure/api/generated/identity/identity';
import { clearCsrfToken, authService } from '@/infrastructure/api/httpClient';
import { logout as logoutAction } from '@/presentation/store/slices/authSlice';
import type { LoginCommand, RegisterCommand } from '@/infrastructure/api/generated/shoppingProjectAPI.schemas';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

/**
 * Hook for managing authentication
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get current user query
  const { data: userResponse, isLoading: isLoadingUser } = useGetApiV1IdentityMe({
    query: {
      queryKey: authKeys.user(),
    },
  });

  // Login mutation
  const loginMutation = usePostApiV1IdentityLogin({
    mutation: {
      onSuccess: () => {
        navigate('/');
        toast.success('Login successful');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Login failed');
      },
    },
  });

  // Register mutation
  const registerMutation = usePostApiV1IdentityRegister({
    mutation: {
      onSuccess: () => {
        toast.success('Registration successful');
        navigate('/login');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Registration failed');
      },
    },
  });

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearCsrfToken();
      dispatch(logoutAction());
      queryClient.clear();
      navigate('/login');
      toast.info('Logged out successfully');
    }
  };

  const login = (credentials: LoginCommand) => {
    loginMutation.mutate({ data: credentials });
  };

  const register = (data: RegisterCommand) => {
    registerMutation.mutate({ data });
  };

  return {
    login,
    isLoggingIn: loginMutation.isPending,
    register,
    isRegistering: registerMutation.isPending,
    logout,
    currentUser: userResponse?.data,
    isLoadingUser: isLoadingUser,
  };
};

/**
 * Hook for checking authentication status
 */
export const useIsAuthenticated = () => {
  const { data: response, isLoading } = useGetApiV1IdentityMe({
    query: {
      queryKey: authKeys.user(),
      retry: false,
    },
  });

  return {
    isAuthenticated: !!response?.data,
    isLoading,
    user: response?.data,
  };
};
