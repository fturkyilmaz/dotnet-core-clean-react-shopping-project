/**
 * Unified Analytics Manager
 * Combines Google Analytics (Firebase), Crashlytics, and local analytics
 * Provides single interface for all tracking needs
 */
import {
  trackEvent as firebaseTrackEvent,
  trackOfflineOperation as firebaseTrackOfflineOperation,
  trackSyncEvent as firebaseTrackSyncEvent,
  trackNetworkChange as firebaseTrackNetworkChange,
  trackPerformanceMetric as firebaseTrackPerformanceMetric,
  trackScreenView as firebaseTrackScreenView,
  trackProductEvent as firebaseTrackProductEvent,
  trackCartEvent as firebaseTrackCartEvent,
  trackException as firebaseTrackException,
  trackCacheMetrics as firebaseTrackCacheMetrics,
} from './firebaseAnalytics';

import CrashlyticsService from './crashlyticsService';
import AnalyticsService from './analyticsService';

/**
 * Unified Analytics Manager
 * Single point of contact for all analytics tracking
 */
export class UnifiedAnalyticsManager {
  private static instance: UnifiedAnalyticsManager;
  private crashlyticsService = CrashlyticsService;
  private localAnalytics = AnalyticsService;
  private sendToFirebase = true;
  private sendToLocal = true;
  private sendToCrashlytics = true;

  private constructor() {}

  static getInstance(): UnifiedAnalyticsManager {
    if (!UnifiedAnalyticsManager.instance) {
      UnifiedAnalyticsManager.instance = new UnifiedAnalyticsManager();
    }
    return UnifiedAnalyticsManager.instance;
  }

  /**
   * Initialize all analytics services
   */
  async initialize(options: {
    enableFirebase?: boolean;
    enableLocal?: boolean;
    enableCrashlytics?: boolean;
  } = {}): Promise<void> {
    try {
      this.sendToFirebase = options.enableFirebase !== false;
      this.sendToLocal = options.enableLocal !== false;
      this.sendToCrashlytics = options.enableCrashlytics !== false;

      // Initialize Crashlytics
      if (this.sendToCrashlytics) {
        await this.crashlyticsService.initialize();
      }

      // Local analytics is already initialized
      console.log('✅ Unified Analytics Manager initialized');
    } catch (error) {
      console.error('Error initializing Analytics Manager:', error);
    }
  }

  // ============= EVENT TRACKING =============

  /**
   * Track custom event
   */
  trackEvent = (eventName: string, parameters?: Record<string, any>): void => {
    if (this.sendToFirebase) {
      firebaseTrackEvent(eventName, parameters);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackEvent(eventName, parameters, 'user');
    }
  };

  /**
   * Track offline operation
   */
  trackOfflineOperation = (
    operationType: 'add' | 'update' | 'delete' | 'deleteAll',
    entityType: string,
    duration: number
  ): void => {
    if (this.sendToFirebase) {
      firebaseTrackOfflineOperation(operationType, entityType, duration);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackOfflineOperation(operationType, entityType, duration);
    }
  };

  /**
   * Track sync event
   */
  trackSyncEvent = (
    syncStatus: 'started' | 'completed' | 'failed',
    data?: {
      duration?: number;
      operationsCount?: number;
      successCount?: number;
      failureCount?: number;
      error?: string;
    }
  ): void => {
    if (this.sendToFirebase) {
      firebaseTrackSyncEvent(syncStatus, data);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackSyncEvent(syncStatus, data);
    }
  };

  /**
   * Track network change
   */
  trackNetworkChange = (isOnline: boolean, signalStrength?: number): void => {
    if (this.sendToFirebase) {
      firebaseTrackNetworkChange(isOnline, signalStrength);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackNetworkChange(isOnline, signalStrength);
    }
  };

  /**
   * Track performance metric
   */
  trackPerformanceMetric = (
    operation: string,
    duration: number,
    metadata?: Record<string, any>
  ): void => {
    if (this.sendToFirebase) {
      firebaseTrackPerformanceMetric(operation, duration, metadata);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackPerformance(operation, duration, metadata);
    }
  };

  /**
   * Track screen view
   */
  trackScreenView = (screenName: string, screenClass?: string): void => {
    if (this.sendToFirebase) {
      firebaseTrackScreenView(screenName, screenClass);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackEvent(`screen_view_${screenName}`, {
        screen_name: screenName,
        screen_class: screenClass,
      }, 'user');
    }
  };

  /**
   * Track product event
   */
  trackProductEvent = (
    action: 'view' | 'click' | 'add_to_cart' | 'remove_from_cart',
    productId: number,
    productName: string,
    price: number,
    category: string
  ): void => {
    if (this.sendToFirebase) {
      firebaseTrackProductEvent(action, productId, productName, price, category);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackEvent(`product_${action}`, {
        product_id: productId,
        product_name: productName,
        price,
        category,
      }, 'user');
    }
  };

  /**
   * Track cart event
   */
  trackCartEvent = (
    action: 'view' | 'add_item' | 'remove_item' | 'checkout',
    cartValue?: number,
    itemCount?: number
  ): void => {
    if (this.sendToFirebase) {
      firebaseTrackCartEvent(action, cartValue, itemCount);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackEvent(`cart_${action}`, {
        cart_value: cartValue,
        item_count: itemCount,
      }, 'user');
    }
  };

  /**
   * Track cache metrics
   */
  trackCacheMetrics = (
    cacheHitRate: number,
    averageResponseTime: number,
    itemCount: number
  ): void => {
    if (this.sendToFirebase) {
      firebaseTrackCacheMetrics(cacheHitRate, averageResponseTime, itemCount);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackMetric('cache_hit_rate', cacheHitRate, {
        'response_time_ms': averageResponseTime.toString(),
        'item_count': itemCount.toString(),
      });
    }
  };

  // ============= ERROR TRACKING =============

  /**
   * Track exception (sends to both Firebase and Crashlytics)
   */
  trackException = (
    error: Error | string,
    context?: {
      userId?: string;
      operation?: string;
      metadata?: Record<string, any>;
      fatal?: boolean;
    }
  ): void => {
    const errorMessage = error instanceof Error ? error.message : error;

    if (this.sendToFirebase) {
      firebaseTrackException(error, context?.fatal);
    }
    if (this.sendToCrashlytics) {
      if (error instanceof Error) {
        this.crashlyticsService.recordException(error, context);
      } else {
        this.crashlyticsService.recordError(errorMessage, context);
      }
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackEvent('exception', {
        message: errorMessage,
        operation: context?.operation,
        fatal: context?.fatal,
      }, 'performance');
    }
  };

  /**
   * Record fatal error
   */
  recordFatalError = (
    message: string,
    context?: {
      userId?: string;
      operation?: string;
      metadata?: Record<string, any>;
    }
  ): void => {
    if (this.sendToCrashlytics) {
      this.crashlyticsService.recordFatalError(message, context);
    }
    this.trackException(new Error(message), { ...context, fatal: true });
  };

  /**
   * Add breadcrumb (for crash context)
   */
  addBreadcrumb = (
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    metadata?: Record<string, any>
  ): void => {
    if (this.sendToCrashlytics) {
      this.crashlyticsService.addBreadcrumb(message, level, metadata);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackEvent(`breadcrumb_${level}`, {
        message,
        ...metadata,
      }, 'performance');
    }
  };

  // ============= REPORTING & DATA =============

  /**
   * Get comprehensive analytics report
   */
  getReport = () => {
    return {
      local: this.localAnalytics.getReport(),
      crashes: this.crashlyticsService.getCrashReports(),
      metadata: {
        firebaseEnabled: this.sendToFirebase,
        localEnabled: this.sendToLocal,
        crashlyticsEnabled: this.sendToCrashlytics,
      },
    };
  };

  /**
   * Export all analytics data
   */
  exportAllData = (): string => {
    return JSON.stringify(this.getReport(), null, 2);
  };

  /**
   * Clear all analytics data
   */
  clearAllData = (): void => {
    this.localAnalytics.clearData();
    this.crashlyticsService.clearReports();
    console.log('🗑️ All analytics data cleared');
  };

  /**
   * Get crash reports
   */
  getCrashReports = () => {
    return this.crashlyticsService.getCrashReports();
  };

  /**
   * Get recent crashes
   */
  getRecentCrashes = (limit: number = 10) => {
    return this.crashlyticsService.getRecentCrashes(limit);
  };

  /**
   * Set user ID for tracking
   */
  setUserId = (userId: string): void => {
    if (this.sendToCrashlytics) {
      this.crashlyticsService.setUserId(userId);
    }
    if (this.sendToLocal) {
      this.localAnalytics.trackEvent('user_id_set', { user_id: userId }, 'user');
    }
  };

  /**
   * Set custom properties
   */
  setCustomProperties = (properties: Record<string, string | number | boolean>): void => {
    Object.entries(properties).forEach(([key, value]) => {
      if (this.sendToCrashlytics) {
        this.crashlyticsService.setCustomKey(key, value);
      }
    });
  };

  /**
   * Enable/disable specific analytics
   */
  setAnalyticsEnabled = (options: {
    firebase?: boolean;
    local?: boolean;
    crashlytics?: boolean;
  }): void => {
    if (options.firebase !== undefined) this.sendToFirebase = options.firebase;
    if (options.local !== undefined) this.sendToLocal = options.local;
    if (options.crashlytics !== undefined) this.sendToCrashlytics = options.crashlytics;
    
    console.log('🔧 Analytics settings updated:', {
      firebase: this.sendToFirebase,
      local: this.sendToLocal,
      crashlytics: this.sendToCrashlytics,
    });
  };
}

export default UnifiedAnalyticsManager.getInstance();
