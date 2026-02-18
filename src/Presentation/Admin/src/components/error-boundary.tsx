import { Component, useState, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Global Error Boundary Component
 *
 * Wrap this around any component to catch errors in its child tree.
 * The most common use case is to wrap the entire app or major sections.
 *
 * @example
 * ```tsx
 * // Wrap entire app in main.tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * // Or wrap specific sections
 * <ErrorBoundary>
 *   <Dashboard />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error - in production, this could be sent to a logging service
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })

    // Here you could also:
    // - Send error to error reporting service (Sentry, Bugsnag, etc.)
    // - Dispatch to Redux/Zustand store
    // - Track in analytics
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleGoHome = (): void => {
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Please try again or contact support if the problem persists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message */}
              {this.state.error && (
                <div className="rounded-md bg-muted p-3">
                  <p className="mb-2 text-sm font-medium">Error Details:</p>
                  <p className="break-all text-xs text-muted-foreground">
                    {this.state.error.message || 'Unknown error'}
                  </p>
                </div>
              )}

              {/* Component Stack */}
              {this.state.errorInfo?.componentStack && (
                <details className="cursor-pointer text-xs">
                  <summary className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Bug className="h-3 w-3" />
                    Show component stack
                  </summary>
                  <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-2 text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1 gap-2"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1 gap-2"
                  variant="outline"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Support Message */}
              <p className="text-center text-xs text-muted-foreground">
                If this error keeps happening, please{' '}
                <a
                  href="mailto:support@example.com"
                  className="underline underline-offset-2 hover:text-primary"
                >
                  contact support
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook for using error boundary functionality in functional components
 * Useful when you need to manually trigger error states
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null)

  const handleError = (err: Error | string) => {
    const errorObj = typeof err === 'string' ? new Error(err) : err
    // eslint-disable-next-line no-console
    console.error('Manual error caught:', errorObj)
    setError(errorObj)
  }

  const clearError = () => {
    setError(null)
  }

  return { error, handleError, clearError }
}

/**
 * Page Error Boundary - Specifically designed for page-level errors
 * Provides a cleaner, more focused error state for full pages
 */
interface PageErrorBoundaryProps {
  children: ReactNode
  title?: string
  description?: string
}

export function PageErrorBoundary({
  children,
  title = 'Page Error',
  description = 'This page encountered an error and could not be loaded.',
}: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <Card className="w-full max-w-lg text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
