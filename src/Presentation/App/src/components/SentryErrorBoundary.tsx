import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text } from "react-native";
import * as Sentry from "@sentry/react-native";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Sentry Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs them to Sentry, and displays a fallback UI.
 * 
 * @example
 * <SentryErrorBoundary fallback={<ErrorScreen />}>
 *   <YourComponent />
 * </SentryErrorBoundary>
 */
export class SentryErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Send error to Sentry
        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
            tags: {
                error_boundary: "true",
            },
        });

        // Log to console in development
        if (__DEV__) {
            console.error("Error caught by boundary:", error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                this.props.fallback || (
                    <View className="flex-1 justify-center items-center p-5 bg-slate-50">
                        <Text className="text-xl font-bold text-red-500 mb-2.5">
                            Something went wrong
                        </Text>
                        <Text className="text-base text-slate-500 text-center">
                            We've been notified and are working to fix the issue.
                        </Text>
                        {__DEV__ && this.state.error && (
                            <Text className="mt-5 p-2.5 bg-red-100 rounded text-red-800 text-xs">
                                {this.state.error.message}
                            </Text>
                        )}
                    </View>
                )
            );
        }

        return this.props.children;
    }
}

export default SentryErrorBoundary;
