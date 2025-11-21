import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authApi, LoginRequest, RegisterRequest } from '../api/auth.api';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.succeeded && data.data) {
        // Decode JWT to get user info (simple decode, not verification)
        const payload = JSON.parse(atob(data.data.split('.')[1]));
        dispatch(setCredentials({
          user: {
            id: payload.sub || payload.nameid,
            email: payload.email,
            roles: payload.role ? (Array.isArray(payload.role) ? payload.role : [payload.role]) : [],
          },
          token: data.data,
        }));
        toast.success('Login successful!');
      } else {
        toast.error(data.errors || 'Login failed');
      }
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success('Registration successful! Please login.');
      } else {
        toast.error(data.errors || 'Registration failed');
      }
    },
    onError: () => {
      toast.error('Registration failed');
    },
  });

  const logout = () => {
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
