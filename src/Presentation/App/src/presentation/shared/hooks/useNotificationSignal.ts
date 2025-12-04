import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import * as Notifications from 'expo-notifications';

export const useNotificationSignal = (notificationConnection: signalR.HubConnection | null) => {
  useEffect(() => {
    if (!notificationConnection) return;

    notificationConnection.on('ReceiveNotification', (notification) => {
      console.log('Notification received:', notification);
      Notifications.scheduleNotificationAsync({
        content: {
          title: notification.Title || 'Notification',
          body: notification.Message || notification.Body,
          data: notification.Data || notification,
        },
        trigger: null,
      });
    });

    return () => {
      notificationConnection.off('ReceiveNotification');
    };
  }, [notificationConnection]);
};
