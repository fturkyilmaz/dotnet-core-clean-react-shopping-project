import { useCallback } from "react";
import * as Sentry from "@sentry/react-native";
import type { SeverityLevel } from "@sentry/core";

interface UserContext {
    id?: string;
    email?: string;
    username?: string;
}

/**
 * Custom hook for Sentry error tracking
 * 
 * Provides convenient methods for:
 * - Capturing exceptions
 * - Setting user context
 * - Adding breadcrumbs
 * - Performance monitoring
 * 
 * @example
 * const { captureException, setUser, addBreadcrumb } = useSentry();
 * 
 * // Capture an error
 * captureException(error, { tags: { feature: 'checkout' } });
 * 
 * // Set user context
 * setUser({ id: '123', email: 'user@example.com' });
 * 
 * // Add breadcrumb
 * addBreadcrumb('User clicked checkout button', 'user');
 */
export const useSentry = () => {
    /**
     * Capture an exception and send to Sentry
     */
    const captureException = useCallback(
        (error: Error | unknown, context?: { tags?: Record<string, string>; extra?: Record<string, unknown> }) => {
            if (error instanceof Error) {
                Sentry.captureException(error, {
                    tags: context?.tags,
                    extra: context?.extra,
                });
            } else {
                Sentry.captureException(new Error(String(error)), {
                    tags: context?.tags,
                    extra: context?.extra,
                });
            }
        },
        []
    );

    /**
     * Set user context for all subsequent events
     */
    const setUser = useCallback((user: UserContext | null) => {
        if (user) {
            Sentry.setUser({
                id: user.id,
                email: user.email,
                username: user.username,
            });
        } else {
            Sentry.setUser(null);
        }
    }, []);

    /**
     * Add a breadcrumb to the current scope
     */
    const addBreadcrumb = useCallback(
        (message: string, category?: string, level?: SeverityLevel, data?: Record<string, unknown>) => {
            Sentry.addBreadcrumb({
                message,
                category,
                level,
                data,
            });
        },
        []
    );

    /**
     * Set custom tags for the current scope
     */
    const setTag = useCallback((key: string, value: string) => {
        Sentry.setTag(key, value);
    }, []);

    /**
     * Start a performance span (updated API for Sentry v6+)
     */
    const startSpan = useCallback(
        (name: string, op?: string) => {
            return Sentry.startInactiveSpan({
                name,
                op,
            });
        },
        []
    );

    /**
     * Clear the current scope (user, tags, breadcrumbs)
     */
    const clearScope = useCallback(() => {
        const scope = Sentry.getCurrentScope();
        scope.clear();
    }, []);

    return {
        captureException,
        setUser,
        addBreadcrumb,
        setTag,
        startSpan,
        clearScope,
        // Expose Sentry instance for advanced use cases
        Sentry,
    };
};

export default useSentry;
