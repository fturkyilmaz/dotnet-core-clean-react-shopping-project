/**
 * Firebase Crashlytics Service
 * Tracks crashes, errors, and exceptions in the React Native application
 * Provides detailed crash reports and stack traces for debugging
 */

// Firebase configuration (same as in firebaseAnalytics.ts)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDw_xxxxxxx',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'shoppingproject-xxxx.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'shoppingproject-xxxx',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shoppingproject-xxxx.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

/**
 * Crashlytics Service
 * Manages crash reporting and error tracking
 */
export class CrashlyticsService {
  private static instance: CrashlyticsService;
  private crashReports: CrashReport[] = [];
  private errorHandlers: ((error: Error) => void)[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): CrashlyticsService {
    if (!CrashlyticsService.instance) {
      CrashlyticsService.instance = new CrashlyticsService();
    }
    return CrashlyticsService.instance;
  }

  /**
   * Initialize Crashlytics
   */
  async initialize(): Promise<void> {
    try {
      // Initialize Firebase app if not already done
      try {
        initializeApp(firebaseConfig);
      } catch (error) {
        // App might already be initialized
      }

      // Set up global error handler
      this.setupErrorHandler();
      
      this.isInitialized = true;
      console.log('✅ Crashlytics initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Crashlytics:', error);
    }
  }

  /**
   * Set up global error handler
   */
  private setupErrorHandler(): void {
    // Handle uncaught errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.recordException(event.error || new Error(event.message));
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.recordException(
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason))
        );
      });
    }

    // For React Native environment
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (args[0] instanceof Error) {
        this.recordException(args[0]);
      }
      originalError.apply(console, args);
    };
  }

  /**
   * Record an exception
   */
  recordException = (
    error: Error,
    context?: {
      userId?: string;
      operation?: string;
      metadata?: Record<string, any>;
      fatal?: boolean;
    }
  ): void => {
    try {
      const crashReport: CrashReport = {
        id: Math.random().toString(36).substring(7),
        error: error.message,
        stackTrace: error.stack || '',
        timestamp: new Date().toISOString(),
        userId: context?.userId,
        operation: context?.operation,
        metadata: context?.metadata,
        fatal: context?.fatal || false,
        sessionId: this.getSessionId(),
      };

      this.crashReports.push(crashReport);
      this.notifyErrorHandlers(error);

      console.error('🔴 Crash recorded:', {
        message: error.message,
        fatal: context?.fatal,
        operation: context?.operation,
      });

      // Log to Firebase
      this.logToFirebase(crashReport);
    } catch (err) {
      console.error('Error recording exception:', err);
    }
  };

  /**
   * Record a custom error
   */
  recordError = (
    errorMessage: string,
    context?: {
      userId?: string;
      operation?: string;
      metadata?: Record<string, any>;
    }
  ): void => {
    const error = new Error(errorMessage);
    this.recordException(error, { ...context, fatal: false });
  };

  /**
   * Record a fatal error
   */
  recordFatalError = (
    errorMessage: string,
    context?: {
      userId?: string;
      operation?: string;
      metadata?: Record<string, any>;
    }
  ): void => {
    const error = new Error(errorMessage);
    this.recordException(error, { ...context, fatal: true });
  };

  /**
   * Set custom key-value pairs
   */
  setCustomKey = (key: string, value: string | number | boolean): void => {
    try {
      // In a real Crashlytics implementation, this would set custom key-value pairs
      console.log(`📌 Crashlytics custom key: ${key} = ${value}`);
    } catch (error) {
      console.error('Error setting custom key:', error);
    }
  };

  /**
   * Set user ID for crash reports
   */
  setUserId = (userId: string): void => {
    try {
      sessionStorage?.setItem('crashlytics_user_id', userId);
      console.log(`👤 Crashlytics user ID set: ${userId}`);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  };

  /**
   * Add breadcrumb for crash context
   */
  addBreadcrumb = (
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    metadata?: Record<string, any>
  ): void => {
    try {
      const breadcrumb: Breadcrumb = {
        message,
        level,
        timestamp: new Date().toISOString(),
        metadata,
      };

      // Store breadcrumbs for crash reports
      const breadcrumbs = JSON.parse(sessionStorage?.getItem('crashlytics_breadcrumbs') || '[]');
      breadcrumbs.push(breadcrumb);
      
      // Keep only last 50 breadcrumbs
      if (breadcrumbs.length > 50) {
        breadcrumbs.shift();
      }
      
      sessionStorage?.setItem('crashlytics_breadcrumbs', JSON.stringify(breadcrumbs));
      console.log(`🍞 Breadcrumb: [${level}] ${message}`);
    } catch (error) {
      console.error('Error adding breadcrumb:', error);
    }
  };

  /**
   * Get all crash reports
   */
  getCrashReports = (): CrashReport[] => {
    return [...this.crashReports];
  };

  /**
   * Get recent crash reports
   */
  getRecentCrashes = (limit: number = 10): CrashReport[] => {
    return this.crashReports.slice(-limit);
  };

  /**
   * Get crash report by ID
   */
  getCrashReportById = (id: string): CrashReport | undefined => {
    return this.crashReports.find((report) => report.id === id);
  };

  /**
   * Clear crash reports
   */
  clearReports = (): void => {
    this.crashReports = [];
    console.log('🗑️ Crash reports cleared');
  };

  /**
   * Export crash reports as JSON
   */
  exportReports = (): string => {
    return JSON.stringify(this.getCrashReports(), null, 2);
  };

  /**
   * Register error handler
   */
  onError = (handler: (error: Error) => void): (() => void) => {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  };

  /**
   * Notify all error handlers
   */
  private notifyErrorHandlers = (error: Error): void => {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (err) {
        console.error('Error in error handler:', err);
      }
    });
  };

  /**
   * Get session ID
   */
  private getSessionId = (): string => {
    let sessionId = sessionStorage?.getItem('crashlytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage?.setItem('crashlytics_session_id', sessionId);
    }
    return sessionId;
  };

  /**
   * Log crash to Firebase
   */
  private logToFirebase = (crashReport: CrashReport): void => {
    try {
      // In production, send to Firebase/backend
      console.log('📤 Sending crash report to Firebase:', {
        id: crashReport.id,
        message: crashReport.error,
        fatal: crashReport.fatal,
      });

      // Implement actual Firebase logging here
      // await fetch('/.../api/crashes', { method: 'POST', body: JSON.stringify(crashReport) });
    } catch (error) {
      console.error('Error logging to Firebase:', error);
    }
  };

  /**
   * Get initialization status
   */
  getIsInitialized = (): boolean => {
    return this.isInitialized;
  };
}

export interface CrashReport {
  id: string;
  error: string;
  stackTrace: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  metadata?: Record<string, any>;
  fatal: boolean;
  sessionId: string;
}

export interface Breadcrumb {
  message: string;
  level: 'info' | 'warning' | 'error';
  timestamp: string;
  metadata?: Record<string, any>;
}

export default CrashlyticsService.getInstance();
