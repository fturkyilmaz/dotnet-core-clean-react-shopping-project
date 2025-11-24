import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:5000'; // Change to your API URL

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useSignalRConnection = () => {
  const [notificationConnection, setNotificationConnection] = useState<signalR.HubConnection | null>(null);
  const [cartConnection, setCartConnection] = useState<signalR.HubConnection | null>(null);
  const [orderConnection, setOrderConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // Register for push notifications
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
      
      console.log('Expo Push Token:', token);
    } else {
      // alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  useEffect(() => {
    const setupConnections = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          console.log('No auth token found');
          return;
        }

        // Register for push notifications
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          setExpoPushToken(pushToken);
        }

        // Create SignalR connections
        const notifConn = new signalR.HubConnectionBuilder()
          .withUrl(`${API_URL}/hubs/notifications`, {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        const cartConn = new signalR.HubConnectionBuilder()
          .withUrl(`${API_URL}/hubs/cart`, {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        const orderConn = new signalR.HubConnectionBuilder()
          .withUrl(`${API_URL}/hubs/orders`, {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Start connections
        await Promise.all([
          notifConn.start(),
          cartConn.start(),
          orderConn.start(),
        ]);

        console.log('SignalR connections established');
        setIsConnected(true);

        // Register push token with backend
        if (pushToken) {
          await notifConn.invoke('RegisterPushToken', pushToken, Platform.OS);
        }

        setNotificationConnection(notifConn);
        setCartConnection(cartConn);
        setOrderConnection(orderConn);

        // Setup notification listeners
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Notification response:', response);
          // Handle deep linking here
        });

      } catch (error) {
        console.error('SignalR connection error:', error);
        setIsConnected(false);
      }
    };

    setupConnections();

    return () => {
      notificationConnection?.stop();
      cartConnection?.stop();
      orderConnection?.stop();
      
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Helper function to send local notification
  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });
  };

  return {
    notificationConnection,
    cartConnection,
    orderConnection,
    isConnected,
    expoPushToken,
    sendLocalNotification,
  };
};
