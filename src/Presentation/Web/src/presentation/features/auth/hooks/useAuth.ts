/**
 * Auth Hooks - Using Service Pattern
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '@services/dependencyInjector';
import type { LoginCredentials, RegisterData } from '@core/domain/ports/IAuthService';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (authResult) => {
      // Store credentials in Redux
      dispatch(
        setCredentials({
          user: authResult.user,
          token: authResult.accessToken,
        })
      );

      navigate('/');
      toast.success('Login successful');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Login failed');
    },
  });

  /**
   * Register mutation
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      toast.success('Registration successful');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Registration failed');
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
      toast.info('Logged out successfully');
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
