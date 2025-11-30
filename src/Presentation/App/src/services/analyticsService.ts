/**
 * Local Analytics Service
 * Tracks events and metrics locally before sending to Firebase
 */
export class AnalyticsService {
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
  trackEvent(name: string, data?: any, type: string = 'user'): void {
    this.events.push({
      name,
      data,
      type,
      timestamp: Date.now(),
    });
    console.log(`📊 Event: ${name}`);
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
    this.trackEvent(`offline_${operationType}`, {
      entity_type: entityType,
      duration,
    }, 'offline');
  }

  /**
   * Track sync event
   */
  trackSyncEvent(
    syncStatus: 'started' | 'completed' | 'failed',
    data?: any
  ): void {
    this.trackEvent(`sync_${syncStatus}`, data, 'sync');
  }

  /**
   * Track performance
   */
  trackPerformance(operation: string, duration: number, metadata?: any): void {
    this.trackMetric(`perf_${operation}`, duration);
    this.trackEvent(`performance_${operation}`, { duration, ...metadata }, 'performance');
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
