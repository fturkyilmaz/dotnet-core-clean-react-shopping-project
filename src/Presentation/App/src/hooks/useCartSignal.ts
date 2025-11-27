import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import * as Notifications from 'expo-notifications';

export const useCartSignal = (cartConnection: signalR.HubConnection | null) => {
  useEffect(() => {
    if (!cartConnection) return;

    cartConnection.on('ItemAdded', (item) => {
      console.log('Item added to cart:', item);
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Item Added',
          body: `${item.Title} added to your cart`,
          data: { type: 'cart', action: 'item_added', item },
        },
        trigger: null,
      });
    });

    cartConnection.on('ItemRemoved', (itemId) => {
      console.log('Item removed from cart:', itemId);
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Item Removed',
          body: 'Item removed from your cart',
          data: { type: 'cart', action: 'item_removed', itemId },
        },
        trigger: null,
      });
    });

    cartConnection.on('CartCleared', () => {
      console.log('Cart cleared');
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Cart Cleared',
          body: 'Your cart has been cleared',
          data: { type: 'cart', action: 'cart_cleared' },
        },
        trigger: null,
      });
    });

    cartConnection.on('CartUpdated', (cartData) => {
      console.log('Cart updated:', cartData);
    });

    return () => {
      cartConnection.off('ItemAdded');
      cartConnection.off('ItemRemoved');
      cartConnection.off('CartCleared');
      cartConnection.off('CartUpdated');
    };
  }, [cartConnection]);
};
