import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import { AuthResponse, User, LoginRequest, ApiResponse } from '@/types';
import secureStorage from '@/infrastructure/services/SecureStorageService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Load token from secure storage on app startup
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const token = await secureStorage.getItem('token');
    return token;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/identity/login', credentials);

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || 'Login failed');
      }

      const { accessToken, refreshToken } = response.data.data;

      // Save tokens securely using expo-secure-store
      await secureStorage.setItem('token', accessToken);
      await secureStorage.setItem('refreshToken', refreshToken);

      // Save email for biometric login identification only
      // Password is NEVER stored - refresh token is used instead
      await secureStorage.setItem('user_email', credentials.email);
      await secureStorage.setItem('biometric_enabled', 'true');

      return response.data.data;
    } catch (error: any) {
      if (__DEV__) {
        console.error('Login error:', error);
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || error.message || 'Login failed');
      }
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const biometricLogin = createAsyncThunk(
  'auth/biometricLogin',
  async (_, { rejectWithValue }) => {
    try {
      const email = await secureStorage.getItem('user_email');
      const refreshToken = await secureStorage.getItem('refreshToken');
      const biometricEnabled = await secureStorage.getItem('biometric_enabled');

      if (!biometricEnabled || biometricEnabled !== 'true') {
        return rejectWithValue('Biometric login not enabled');
      }

      if (email && refreshToken) {
        // Use refresh token for biometric authentication
        const response = await api.post<ApiResponse<AuthResponse>>('/identity/refresh', {
          refreshToken,
        });

        if (!response.data.isSuccess) {
          return rejectWithValue('Session expired. Please login with credentials.');
        }

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens
        await secureStorage.setItem('token', accessToken);
        await secureStorage.setItem('refreshToken', newRefreshToken);

        return { email, accessToken };
      } else {
        return rejectWithValue('No valid session for biometric login');
      }
    } catch (error: any) {
      if (__DEV__) {
        console.error('Biometric login error:', error);
      }
      return rejectWithValue(error.response?.data?.message || 'Biometric login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await secureStorage.removeItem('token');
  await secureStorage.removeItem('refreshToken');
  await secureStorage.removeItem('user_email');
  await secureStorage.removeItem('biometric_enabled');
});

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<User>>('/identity/me');
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(biometricLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(biometricLogin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(biometricLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
