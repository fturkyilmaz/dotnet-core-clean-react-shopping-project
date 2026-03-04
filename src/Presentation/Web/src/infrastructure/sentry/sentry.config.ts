import * as Sentry from "@sentry/react";
import type { Event } from "@sentry/react";

export const initSentry = () => {
    if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            // Performance Monitoring
            tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            environment: import.meta.env.MODE,
            release: import.meta.env.VITE_APP_VERSION || "unknown",
            beforeSend(event: Event) {
                // Filter out specific errors if needed
                if (event.exception?.values?.[0]?.type === "ChunkLoadError") {
                    return null;
                }
                return event;
            },
        });
    }
};

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;
export const setTag = Sentry.setTag;
