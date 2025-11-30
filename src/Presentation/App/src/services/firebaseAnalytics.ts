/**
 * Firebase Analytics Service
 * Integrates Google Analytics for tracking user behavior, performance, and offline metrics
 * Also integrates Firebase Crashlytics for crash reporting
 */

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDw_xxxxxxx',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'shoppingproject-xxxx.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'shoppingproject-xxxx',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shoppingproject-xxxx.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

let isInitialized = false;

/**
 * Initialize Firebase Analytics
 */
export const initializeFirebaseAnalytics = async () => {
  try {
    // In production, use: import { initializeApp } from 'firebase/app';
    // For now, we'll track events locally
    isInitialized = true;
    console.log('✅ Firebase Analytics initialized (local mode)');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Analytics:', error);
    return null;
  }
};

/**
 * Track custom event
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!isInitialized) {
    console.warn('Analytics not initialized');
    return;
  }

  try {
    console.log(`📊 Event tracked: ${eventName}`, parameters);
    // In production, send to Firebase
  } catch (error) {
    console.error(`Error tracking event ${eventName}:`, error);
  }
};

/**
 * Track offline operation
 */
export const trackOfflineOperation = (
  operationType: 'add' | 'update' | 'delete' | 'deleteAll',
  entityType: string,
  duration: number
) => {
  trackEvent('offline_operation', {
    operation_type: operationType,
    entity_type: entityType,
    duration_ms: duration,
  });
};

/**
 * Track sync event
 */
export const trackSyncEvent = (
  syncStatus: 'started' | 'completed' | 'failed',
  data?: {
    duration?: number;
    operationsCount?: number;
    successCount?: number;
    failureCount?: number;
    error?: string;
  }
) => {
  trackEvent(`sync_${syncStatus}`, {
    duration_ms: data?.duration || 0,
    operations_count: data?.operationsCount || 0,
    success_count: data?.successCount || 0,
    failure_count: data?.failureCount || 0,
    error: data?.error || null,
  });
};

/**
 * Track network status change
 */
export const trackNetworkChange = (isOnline: boolean, signalStrength?: number) => {
  trackEvent(isOnline ? 'network_online' : 'network_offline', {
    signal_strength: signalStrength || null,
  });
};

/**
 * Track performance metric
 */
export const trackPerformanceMetric = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  trackEvent('performance_metric', {
    operation,
    duration_ms: duration,
    ...metadata,
  });
};

/**
 * Track screen view
 */
export const trackScreenView = (screenName: string, screenClass?: string) => {
  trackEvent('screen_view', {
    firebase_screen: screenName,
    firebase_screen_class: screenClass || screenName,
  });
};

/**
 * Track user engagement
 */
export const trackUserEngagement = (
  sessionLength: number,
  screenCount: number,
  eventCount: number
) => {
  trackEvent('user_engagement', {
    session_length_ms: sessionLength,
    screens_viewed: screenCount,
    events_triggered: eventCount,
  });
};

/**
 * Track cart event
 */
export const trackCartEvent = (
  action: 'view' | 'add_item' | 'remove_item' | 'checkout',
  cartValue?: number,
  itemCount?: number
) => {
  trackEvent(`cart_${action}`, {
    cart_value: cartValue || 0,
    item_count: itemCount || 0,
  });
};

/**
 * Track product event
 */
export const trackProductEvent = (
  action: 'view' | 'click' | 'add_to_cart' | 'remove_from_cart',
  productId: number,
  productName: string,
  price: number,
  category: string
) => {
  trackEvent(`product_${action}`, {
    product_id: productId,
    product_name: productName,
    value: price,
    category: category,
  });
};

/**
 * Track exception/error
 */
export const trackException = (error: Error | string, fatal: boolean = false) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  trackEvent('exception', {
    description: errorMessage,
    fatal: fatal,
  });

  console.error(`🔴 Exception tracked: ${errorMessage}`);
};

/**
 * Track custom cache metrics
 */
export const trackCacheMetrics = (
  cacheHitRate: number,
  averageResponseTime: number,
  itemCount: number
) => {
  trackEvent('cache_metrics', {
    cache_hit_rate: cacheHitRate,
    average_response_time_ms: averageResponseTime,
    cached_item_count: itemCount,
  });
};

export default {
  initializeFirebaseAnalytics,
  trackEvent,
  trackOfflineOperation,
  trackSyncEvent,
  trackNetworkChange,
  trackPerformanceMetric,
  trackScreenView,
  trackUserEngagement,
  trackCartEvent,
  trackProductEvent,
  trackException,
  trackCacheMetrics,
};
