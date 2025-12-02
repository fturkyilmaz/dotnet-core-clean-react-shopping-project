import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi, LoginRequest, RegisterRequest } from '@api/auth.api';
import { setCredentials, logout as logoutAction } from '@store/slices/authSlice';
import { setAuthToken, setRefreshToken } from '@api/axios';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      // Store tokens in localStorage
      setAuthToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      // Decode token to get user info (or use the one from response if available)
      // For now, we'll fetch user info immediately after login
      // But we can also dispatch what we have if the backend returns user info in login response
      // The current backend login response only has tokens.
      
      // Dispatch to Redux (we need to fetch user details first or decode token)
      // Let's fetch user details
      queryClient.fetchQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser
      }).then(user => {
         dispatch(setCredentials({
            user: {
              id: user.id,
              email: user.email,
              roles: [] // Backend doesn't return roles in user info yet, need to fix or decode token
            },
            token: data.accessToken
         }));
         navigate('/');
         toast.success('Login successful');
      });
    },
    onError: (error: any) => {
      // Error handling is done globally in queryClient, but we can add specific logic here
      console.error('Login failed:', error);
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast.success('Registration successful. Please login.');
      navigate('/login');
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(logoutAction());
      navigate('/login');
      toast.info('Logged out successfully');
      queryClient.clear();
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending
  };
};
