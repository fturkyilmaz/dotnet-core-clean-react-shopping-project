import * as signalR from '@microsoft/signalr';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SignalRService {
  private notificationConnection: signalR.HubConnection | null = null;
  private cartConnection: signalR.HubConnection | null = null;
  private orderConnection: signalR.HubConnection | null = null;
  private isConnected = false;

  // Notification callbacks
  private notificationCallbacks: ((notification: any) => void)[] = [];
  
  // Cart callbacks
  private cartItemAddedCallbacks: ((item: any) => void)[] = [];
  private cartItemRemovedCallbacks: ((itemId: string) => void)[] = [];
  private cartClearedCallbacks: (() => void)[] = [];
  private cartUpdatedCallbacks: ((cartData: any) => void)[] = [];
  
  // Order callbacks
  private orderCreatedCallbacks: ((data: any) => void)[] = [];
  private orderStatusChangedCallbacks: ((data: any) => void)[] = [];

  async connect(token: string): Promise<void> {
    if (this.isConnected) {
      console.log('SignalR already connected');
      return;
    }

    try {
      // Create connections
      this.notificationConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_URL}/hubs/notifications`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.cartConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_URL}/hubs/cart`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.orderConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_URL}/hubs/orders`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Setup notification handlers
      this.notificationConnection.on('ReceiveNotification', (notification) => {
        console.log('Notification received:', notification);
        this.notificationCallbacks.forEach(callback => callback(notification));
      });

      // Setup cart handlers
      this.cartConnection.on('ItemAdded', (item) => {
        console.log('Item added to cart:', item);
        this.cartItemAddedCallbacks.forEach(callback => callback(item));
      });

      this.cartConnection.on('ItemRemoved', (itemId) => {
        console.log('Item removed from cart:', itemId);
        this.cartItemRemovedCallbacks.forEach(callback => callback(itemId));
      });

      this.cartConnection.on('CartCleared', () => {
        console.log('Cart cleared');
        this.cartClearedCallbacks.forEach(callback => callback());
      });

      this.cartConnection.on('CartUpdated', (cartData) => {
        console.log('Cart updated:', cartData);
        this.cartUpdatedCallbacks.forEach(callback => callback(cartData));
      });

      // Setup order handlers
      this.orderConnection.on('OrderCreated', (data) => {
        console.log('Order created:', data);
        this.orderCreatedCallbacks.forEach(callback => callback(data));
      });

      this.orderConnection.on('OrderStatusChanged', (data) => {
        console.log('Order status changed:', data);
        this.orderStatusChangedCallbacks.forEach(callback => callback(data));
      });

      // Start all connections
      await Promise.all([
        this.notificationConnection.start(),
        this.cartConnection.start(),
        this.orderConnection.start(),
      ]);

      this.isConnected = true;
      console.log('SignalR connections established');
    } catch (error) {
      console.error('SignalR connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await Promise.all([
        this.notificationConnection?.stop(),
        this.cartConnection?.stop(),
        this.orderConnection?.stop(),
      ]);

      this.isConnected = false;
      console.log('SignalR connections closed');
    } catch (error) {
      console.error('SignalR disconnection error:', error);
    }
  }

  // Notification methods
  onNotification(callback: (notification: any) => void): () => void {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  async sendTestNotification(message: string): Promise<void> {
    if (!this.notificationConnection) {
      throw new Error('Notification connection not established');
    }
    await this.notificationConnection.invoke('SendTestNotification', message);
  }

  // Cart methods
  onCartItemAdded(callback: (item: any) => void): () => void {
    this.cartItemAddedCallbacks.push(callback);
    return () => {
      this.cartItemAddedCallbacks = this.cartItemAddedCallbacks.filter(cb => cb !== callback);
    };
  }

  onCartItemRemoved(callback: (itemId: string) => void): () => void {
    this.cartItemRemovedCallbacks.push(callback);
    return () => {
      this.cartItemRemovedCallbacks = this.cartItemRemovedCallbacks.filter(cb => cb !== callback);
    };
  }

  onCartCleared(callback: () => void): () => void {
    this.cartClearedCallbacks.push(callback);
    return () => {
      this.cartClearedCallbacks = this.cartClearedCallbacks.filter(cb => cb !== callback);
    };
  }

  onCartUpdated(callback: (cartData: any) => void): () => void {
    this.cartUpdatedCallbacks.push(callback);
    return () => {
      this.cartUpdatedCallbacks = this.cartUpdatedCallbacks.filter(cb => cb !== callback);
    };
  }

  async requestCartSync(): Promise<void> {
    if (!this.cartConnection) {
      throw new Error('Cart connection not established');
    }
    await this.cartConnection.invoke('RequestCartSync');
  }

  // Order methods
  onOrderCreated(callback: (data: any) => void): () => void {
    this.orderCreatedCallbacks.push(callback);
    return () => {
      this.orderCreatedCallbacks = this.orderCreatedCallbacks.filter(cb => cb !== callback);
    };
  }

  onOrderStatusChanged(callback: (data: any) => void): () => void {
    this.orderStatusChangedCallbacks.push(callback);
    return () => {
      this.orderStatusChangedCallbacks = this.orderStatusChangedCallbacks.filter(cb => cb !== callback);
    };
  }

  async requestOrderStatus(orderId: string): Promise<void> {
    if (!this.orderConnection) {
      throw new Error('Order connection not established');
    }
    await this.orderConnection.invoke('RequestOrderStatus', orderId);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const signalRService = new SignalRService();
export default signalRService;
