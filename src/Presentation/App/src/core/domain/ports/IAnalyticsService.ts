export interface IAnalyticsService {
  logEvent(name: string, params?: Record<string, any>): Promise<void>;
  setUserProperties(properties: Record<string, any>): Promise<void>;
  setUserId(userId: string): Promise<void>;
}
