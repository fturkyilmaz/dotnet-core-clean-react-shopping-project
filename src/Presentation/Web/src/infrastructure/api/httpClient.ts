/**
 * HTTP Client - Infrastructure Layer
 * Axios instance with HttpOnly cookie authentication and CSRF protection
 * NOTE: This version uses HttpOnly cookies for token storage (XSS protection)
 * Previous localStorage-based implementation has been replaced for security
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// XSRF/CSRF Token storage (this can be accessed by JS, unlike HttpOnly cookies)
let csrfToken: string | null = null;

// --------------------
// CSRF Token Utilities
// --------------------
export const getCsrfToken = () => csrfToken;
export const setCsrfToken = (token: string | null) => {
  csrfToken = token;
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

// --------------------
// Axios Instance
// --------------------
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important: Sends cookies (HttpOnly tokens) with requests
});

// --------------------
// Request Interceptor
// --------------------
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token to headers if available
    const xsrfToken = getCsrfToken();
    if (xsrfToken && config.headers) {
      config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    // Authorization header is no longer needed - token is in HttpOnly cookie
    // The backend reads the cookie automatically

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --------------------
// Response Interceptor
// --------------------
httpClient.interceptors.response.use(
  (response) => {
    // Extract XSRF token from response if present
    const newXsrfToken = response.headers['x-xsrf-token'];
    if (newXsrfToken) {
      setCsrfToken(newXsrfToken as string);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry with same config - cookies are automatically included
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token endpoint - HttpOnly cookies are automatically sent
        await axios.post(
          `${API_BASE_URL}/identity/refresh-token`,
          {}, // Empty body - tokens are in cookies
          { withCredentials: true }
        );

        // Extract new XSRF token if provided
        // Note: Access token is in HttpOnly cookie, automatically handled by browser

        processQueue(null, null);
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        clearCsrfToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --------------------
// Auth Service (using HttpOnly cookies)
// --------------------
export const authService = {
  /**
   * Login with credentials
   * Backend sets HttpOnly cookies for access_token and refresh_token
   * Frontend receives XSRF token in response header for CSRF protection
   */
  login: async (email: string, password: string) => {
    const response = await httpClient.post('/identity/login', { email, password });

    // XSRF token is received in header and stored in memory (not localStorage)
    const xsrfToken = response.headers['x-xsrf-token'];
    if (xsrfToken) {
      setCsrfToken(xsrfToken as string);
    }

    return response.data;
  },

  /**
   * Logout - clears cookies by calling backend logout endpoint
   */
  logout: async () => {
    try {
      await httpClient.post('/identity/logout');
    } finally {
      clearCsrfToken();
    }
  },

  /**
   * Check if user is authenticated
   * Backend validates the HttpOnly cookie
   */
  checkAuth: async () => {
    const response = await httpClient.get('/identity/me');
    return response.data;
  },
};

export default httpClient;
