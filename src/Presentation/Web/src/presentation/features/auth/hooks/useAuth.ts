/**
 * Auth Hooks - Using Generated React Query API
 * All API calls are now integrated with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  usePostApiV1IdentityLogin,
  usePostApiV1IdentityRegister,
  useGetApiV1IdentityMe,
} from '@/infrastructure/api/generated/identity/identity';
import { setAuthToken, setRefreshToken, clearTokens } from '@/infrastructure/api/httpClient';
import { setCredentials, logout as logoutAction } from '@/presentation/store/slices/authSlice';
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
  const { data: currentUser, isLoading: isLoadingUser } = useGetApiV1IdentityMe({
    query: {
      queryKey: authKeys.user(),
      select: (response) => response.data.data,
      enabled: !!localStorage.getItem('authToken'),
    },
  });

  // Login mutation
  const loginMutation = usePostApiV1IdentityLogin({
    mutation: {
      onSuccess: (response) => {
        const authResult = response.data.data;
        if (authResult) {
          // Store tokens
          setAuthToken(authResult.accessToken || null);
          setRefreshToken(authResult.refreshToken || null);

          // Store credentials in Redux
          if (currentUser) {
            dispatch(
              setCredentials({
                user: {
                  id: currentUser.id || '',
                  email: currentUser.email || '',
                  roles: currentUser.roles || [],
                },
                token: authResult.accessToken || '',
              })
            );
          }

          navigate('/');
          toast.success('Login successful');
        }
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
  const logout = () => {
    clearTokens();
    dispatch(logoutAction());
    queryClient.clear();
    navigate('/login');
    toast.info('Logged out successfully');
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
    currentUser,
    isLoadingUser,
  };
};

/**
 * Hook for checking authentication status
 */
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useGetApiV1IdentityMe({
    query: {
      queryKey: authKeys.user(),
      select: (response) => response.data.data,
      retry: false,
    },
  });

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};
