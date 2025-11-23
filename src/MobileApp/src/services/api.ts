import axios from 'axios';
import { Platform } from 'react-native';

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

api.interceptors.request.use(
  async (config) => {
    // TODO: Add token from storage
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
