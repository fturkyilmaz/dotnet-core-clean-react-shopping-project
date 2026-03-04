/**
 * SignalR React Query Hook
 * Manages SignalR connection and integrates with React Query cache
 */

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { signalRService } from '@/services/signalRService';
import { toast } from 'sonner';

interface UseSignalROptions {
  token: string | null;
  enabled?: boolean;
}

/**
 * Hook to manage SignalR connection with React Query integration
 */
export const useSignalR = ({ token, enabled = true }: UseSignalROptions) => {
  const queryClient = useQueryClient();
  const unsubscribeRefs = useRef<Array<() => void>>([]);

  // Clear all subscriptions
  const clearSubscriptions = useCallback(() => {
    unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeRefs.current = [];
  }, []);

  useEffect(() => {
    if (!enabled || !token) {
      // Disconnect if no token or disabled
      signalRService.disconnect();
      clearSubscriptions();
      return;
    }

    // Connect to SignalR
    signalRService
      .connect(token)
      .then(() => {
        // Subscribe to cart events and invalidate React Query cache
        const unsubscribeCartAdded = signalRService.onCartItemAdded(() => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        });

        const unsubscribeCartRemoved = signalRService.onCartItemRemoved(() => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        });

        const unsubscribeCartCleared = signalRService.onCartCleared(() => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        });

        const unsubscribeCartUpdated = signalRService.onCartUpdated(() => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        });

        // Subscribe to notifications
        const unsubscribeNotification = signalRService.onNotification((notification) => {
          if (notification.type === 'success') {
            toast.success(notification.message);
          } else if (notification.type === 'error') {
            toast.error(notification.message);
          } else {
            toast.info(notification.message);
          }
        });

        // Store unsubscribe functions
        unsubscribeRefs.current = [
          unsubscribeCartAdded,
          unsubscribeCartRemoved,
          unsubscribeCartCleared,
          unsubscribeCartUpdated,
          unsubscribeNotification,
        ];
      })
      .catch((error) => {
        console.error('Failed to connect SignalR:', error);
      });

    // Cleanup on unmount
    return () => {
      clearSubscriptions();
      signalRService.disconnect();
    };
  }, [token, enabled, queryClient, clearSubscriptions]);

  return {
    isConnected: signalRService.getConnectionStatus(),
    requestCartSync: signalRService.requestCartSync.bind(signalRService),
    requestOrderStatus: signalRService.requestOrderStatus.bind(signalRService),
    sendTestNotification: signalRService.sendTestNotification.bind(signalRService),
  };
};

export default useSignalR;
