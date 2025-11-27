import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import * as Notifications from 'expo-notifications';

export const useOrderSignal = (orderConnection: signalR.HubConnection | null) => {
  useEffect(() => {
    if (!orderConnection) return;

    orderConnection.on('OrderCreated', (data) => {
      console.log('Order created:', data);
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Order Created',
          body: `Your order #${data.OrderId} has been created`,
          data: { type: 'order', action: 'created', orderId: data.OrderId },
        },
        trigger: null,
      });
    });

    orderConnection.on('OrderStatusChanged', (data) => {
      console.log('Order status changed:', data);
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Order Status Updated',
          body: `Order #${data.OrderId} is now ${data.Status}`,
          data: { type: 'order', action: 'status_changed', orderId: data.OrderId, status: data.Status },
        },
        trigger: null,
      });
    });

    return () => {
      orderConnection.off('OrderCreated');
      orderConnection.off('OrderStatusChanged');
    };
  }, [orderConnection]);
};
