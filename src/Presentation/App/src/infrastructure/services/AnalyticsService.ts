import { IAnalyticsService } from '../../core/domain/ports/IAnalyticsService';

/**
 * Local Analytics Service
 * Tracks events and metrics locally before sending to Firebase
 */
export class AnalyticsService implements IAnalyticsService {
  private events: any[] = [];
  private metrics: any[] = [];
  private static instance: AnalyticsService;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track event
   */
  async logEvent(name: string, params?: Record<string, any>): Promise<void> {
    this.events.push({
      name,
      params,
      timestamp: Date.now(),
    });
    console.log(`📊 Event: ${name}`);
  }

  async setUserProperties(properties: Record<string, any>): Promise<void> {
    console.log('User properties set:', properties);
  }

  async setUserId(userId: string): Promise<void> {
    console.log('User ID set:', userId);
  }

  // Legacy methods kept for compatibility or internal use
  trackEvent(name: string, data?: any, type: string = 'user'): void {
    this.logEvent(name, { ...data, type });
  }

  /**
   * Track metric
   */
  trackMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.push({
      name,
      value,
      tags,
      timestamp: Date.now(),
    });
  }

  /**
   * Track offline operation
   */
  trackOfflineOperation(
    operationType: 'add' | 'update' | 'delete' | 'deleteAll',
    entityType: string,
    duration: number
  ): void {
    this.logEvent(`offline_${operationType}`, {
      entity_type: entityType,
      duration,
      type: 'offline'
    });
  }

  /**
   * Track sync event
   */
  trackSyncEvent(
    syncStatus: 'started' | 'completed' | 'failed',
    data?: any
  ): void {
    this.logEvent(`sync_${syncStatus}`, { ...data, type: 'sync' });
  }

  /**
   * Track performance
   */
  trackPerformance(operation: string, duration: number, metadata?: any): void {
    this.trackMetric(`perf_${operation}`, duration);
    this.logEvent(`performance_${operation}`, { duration, ...metadata, type: 'performance' });
  }

  trackException(error: Error, metadata?: any): void {
    this.logEvent('exception', {
      message: error.message,
      stack: error.stack,
      ...metadata
    });
  }

  /**
   * Get all events
   */
  getEvents(): any[] {
    return [...this.events];
  }

  /**
   * Get all metrics
   */
  getMetrics(): any[] {
    return [...this.metrics];
  }

  /**
   * Clear data
   */
  clearData(): void {
    this.events = [];
    this.metrics = [];
  }

  /**
   * Get report
   */
  getReport(): any {
    return {
      events: this.events,
      metrics: this.metrics,
      summary: {
        totalEvents: this.events.length,
        totalMetrics: this.metrics.length,
      },
    };
  }
}

export default AnalyticsService.getInstance();
