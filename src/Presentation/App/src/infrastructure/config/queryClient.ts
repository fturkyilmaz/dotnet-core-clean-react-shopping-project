import { QueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

// Automatically handle online/offline status
onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
    });
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Retry failed requests 3 times
            retry: 3,
            // Exponential backoff for retries
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Data is considered fresh for 5 minutes
            staleTime: 1000 * 60 * 5,
            // Keep unused data in cache for 24 hours (for offline usage)
            gcTime: 1000 * 60 * 60 * 24,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Refetch on mount if data is stale
            refetchOnMount: true,
        },
        mutations: {
            retry: 3,
        },
    },
});
