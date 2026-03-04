import React from "react";
import { ReactQueryDevtools as OriginalDevtools } from "@tanstack/react-query-devtools";

/**
 * React Query Devtools wrapper component
 * 
 * This component only renders in development mode to avoid
 * exposing debugging tools in production builds.
 * 
 * Usage: Add this component inside your QueryClientProvider
 * 
 * @example
 * <QueryClientProvider client={queryClient}>
 *   <App />
 *   <ReactQueryDevtools />
 * </QueryClientProvider>
 */
export const ReactQueryDevtools: React.FC = () => {
    // Only render in development
    if (process.env.NODE_ENV === "production") {
        return null;
    }

    return <OriginalDevtools initialIsOpen={false} position="bottom" />;
};

export default ReactQueryDevtools;
