import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error for debugging
        logger.error('Error Boundary caught an error:', error);
        logger.error('Error Info:', errorInfo);

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // Update state with error details for display
        this.setState({ error, errorInfo });

        // Report to external error monitoring service if needed
        if (typeof window !== 'undefined' && (window as any).reportError) {
            (window as any).reportError(error);
        }
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    private handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div style={{
                    padding: '2rem',
                    margin: '2rem auto',
                    maxWidth: '600px',
                    backgroundColor: '#fee',
                    border: '2px solid #f88',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: '#c33', marginBottom: '1rem' }}>
                        🚨 Something went wrong
                    </h2>

                    <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                        An unexpected error occurred. This has been logged for investigation.
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                        <button
                            onClick={this.handleRetry}
                            style={{
                                padding: '0.5rem 1rem',
                                marginRight: '1rem',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>

                        <button
                            onClick={this.handleReload}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Reload Page
                        </button>
                    </div>

                    {/* Show error details in development */}
                    {import.meta.env.DEV && this.state.error && (
                        <details style={{ textAlign: 'left', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                Error Details (Development Only)
                            </summary>
                            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
