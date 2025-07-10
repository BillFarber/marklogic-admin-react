import React from 'react';
import { logger } from '../utils/logger';
import ErrorBoundary from './ErrorBoundary';

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
  onRetry?: () => void;
}

export function AsyncErrorBoundary({
  children,
  componentName,
  onRetry,
}: AsyncErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    logger.error(`Error in ${componentName}:`, error);
    logger.debug('Component stack:', errorInfo.componentStack);
  };

  const fallbackUI = (
    <div
      style={{
        padding: '1rem',
        margin: '1rem 0',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        textAlign: 'center',
      }}
    >
      <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>
        ⚠️ {componentName} Error
      </h4>
      <p style={{ color: '#856404', marginBottom: '1rem', fontSize: '0.9rem' }}>
        There was an issue loading this section.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}
