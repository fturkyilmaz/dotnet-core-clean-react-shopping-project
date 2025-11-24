import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import { AuthResponse, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('/identity/login', credentials);
      console.log('Full response:', response.data);
      
      // Axios wraps the API response in response.data
      // API response structure: { data: { accessToken, refreshToken, ... }, isSuccess: true, ... }
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      
      // Save tokens to AsyncStorage
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      return {
        token: accessToken,
        refreshToken,
        ...response.data.data
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
});

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
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
