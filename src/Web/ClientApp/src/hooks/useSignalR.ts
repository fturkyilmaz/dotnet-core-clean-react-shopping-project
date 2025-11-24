import { useEffect, useState } from 'react';
import { signalRService } from '../services/signalRService';
import { toast } from 'react-toastify';

export const useSignalR = (token: string | null) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const connectSignalR = async () => {
      try {
        await signalRService.connect(token);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
        setIsConnected(false);
      }
    };

    connectSignalR();

    return () => {
      signalRService.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  return { isConnected };
};

export const useNotifications = () => {
  useEffect(() => {
    const unsubscribe = signalRService.onNotification((notification) => {
      toast.info(notification.Message || notification.Body || 'New notification', {
        position: 'top-right',
        autoClose: 5000,
      });
    });

    return unsubscribe;
  }, []);
};

export const useCartNotifications = (onCartUpdate?: () => void) => {
  useEffect(() => {
    const unsubscribeItemAdded = signalRService.onCartItemAdded((item) => {
      toast.success(`${item.Title || 'Item'} added to cart`, {
        position: 'top-right',
        autoClose: 3000,
      });
      onCartUpdate?.();
    });

    const unsubscribeItemRemoved = signalRService.onCartItemRemoved(() => {
      toast.info('Item removed from cart', {
        position: 'top-right',
        autoClose: 3000,
      });
      onCartUpdate?.();
    });

    const unsubscribeCartCleared = signalRService.onCartCleared(() => {
      toast.info('Cart cleared', {
        position: 'top-right',
        autoClose: 3000,
      });
      onCartUpdate?.();
    });

    const unsubscribeCartUpdated = signalRService.onCartUpdated(() => {
      onCartUpdate?.();
    });

    return () => {
      unsubscribeItemAdded();
      unsubscribeItemRemoved();
      unsubscribeCartCleared();
      unsubscribeCartUpdated();
    };
  }, [onCartUpdate]);
};

export const useOrderNotifications = () => {
  useEffect(() => {
    const unsubscribeOrderCreated = signalRService.onOrderCreated((data) => {
      toast.success(`Order #${data.OrderId} created successfully`, {
        position: 'top-right',
        autoClose: 5000,
      });
    });

    const unsubscribeOrderStatusChanged = signalRService.onOrderStatusChanged((data) => {
      toast.info(`Order #${data.OrderId} status: ${data.Status}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    });

    return () => {
      unsubscribeOrderCreated();
      unsubscribeOrderStatusChanged();
    };
  }, []);
};
