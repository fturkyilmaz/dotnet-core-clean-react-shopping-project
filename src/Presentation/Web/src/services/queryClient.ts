/**
 * React Query Client Configuration
 *
 * Central place for:
 * - retry strategy
 * - cache / stale timings
 * - global mutation error handling
 */

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Do not refetch on window focus to avoid surprising UI jumps.
       * You can override per-query when needed.
       */
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      /**
       * Retry only for non-4xx errors, with exponential backoff.
       */
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) {
          // Client errors are usually not recoverable by retrying
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),
      /**
       * Data is considered fresh for 5 minutes.
       */
      staleTime: 5 * 60 * 1000,
      /**
       * Garbage-collect unused query data after 10 minutes.
       */
      gcTime: 10 * 60 * 1000,
      /**
       * Only run queries when online by default.
       */
      networkMode: 'online',
    },
    mutations: {
      /**
       * Do not retry mutations by default; failures should be explicit.
       */
      retry: false,
      networkMode: 'online',
      /**
       * Global mutation error handler so individual hooks can stay simple.
       */
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          'An unexpected error occurred';
        toast.error(message);
      },
    },
  },
});
