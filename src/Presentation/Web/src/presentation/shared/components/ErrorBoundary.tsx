import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // TODO: Log to error reporting service (e.g., Sentry)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                    <div className="text-center p-5">
                        <div className="mb-4">
                            <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h1 className="display-4 fw-bold mb-3">Oops! Something went wrong</h1>
                        <p className="text-muted mb-4">
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Refresh Page
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={this.handleReset}
                            >
                                Try Again
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-4 p-3 bg-white border rounded text-start">
                                <h5 className="text-danger">Error Details:</h5>
                                <pre className="text-danger small mb-0">
                                    {this.state?.error?.toString()}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
