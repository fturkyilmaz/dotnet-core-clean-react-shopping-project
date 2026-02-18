import axios from 'axios';
import { Platform } from 'react-native';
import secureStorage from '@/infrastructure/services/SecureStorageService';

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator
const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:5000/api/v1'
  : 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const externalApi = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Get token from secure storage
    const token = await secureStorage.getItem('token');

    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
