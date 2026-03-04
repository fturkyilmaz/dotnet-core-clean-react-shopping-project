import * as Sentry from "@sentry/react-native";

// Sentry initialization configuration
export const initSentry = () => {
    Sentry.init({
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",

        // Environment
        environment: process.env.NODE_ENV || "development",

        // Enable debug mode in development
        debug: process.env.NODE_ENV === "development",

        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

        // Session Replay (optional, for debugging user interactions)
        replaysSessionSampleRate: 0.0,
        replaysOnErrorSampleRate: 0.1,

        // Enable automatic instrumentation
        enableAutoPerformanceTracing: true,

        // React Navigation Instrumentation
        enableTracing: true,

        // Attach user info to errors
        beforeSend: (event) => {
            // You can modify events here before sending
            // e.g., filter sensitive data
            return event;
        },

        // Ignore certain errors
        ignoreErrors: [
            // Network errors
            "Network request failed",
            "No internet connection",
            // Redux non-serializable warnings
            "Non-serializable value",
        ],
    });
};

// Export Sentry instance for manual error tracking
export { Sentry };
