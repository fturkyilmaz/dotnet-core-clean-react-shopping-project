import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import { AuthResponse, User, LoginRequest, ApiResponse } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureStorage } from '@/infrastructure/persistence/SecureStorageService';

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

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/identity/login', credentials);

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || 'Login failed');
      }

      const { accessToken, refreshToken } = response.data.data;

      // Save tokens to AsyncStorage
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      // Save credentials securely for biometric login
      await secureStorage.setItem('user_email', credentials.email);
      await secureStorage.setItem('user_password', credentials.password);

      return response.data.data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || error.message || 'Login failed');
      }
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const biometricLogin = createAsyncThunk(
  'auth/biometricLogin',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const email = await secureStorage.getItem('user_email');
      const password = await secureStorage.getItem('user_password');

      if (email && password) {
        // Reuse normal login flow
        await dispatch(login({ email, password }));
        return { email };
      } else {
        return rejectWithValue('No credentials stored for biometric login');
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      return rejectWithValue('Biometric login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('refreshToken');
  await secureStorage.removeItem('user_email');
  await secureStorage.removeItem('user_password');
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
      });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
