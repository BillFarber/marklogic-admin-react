import { useCallback, useState } from 'react';
import { logger } from '../utils/logger';

interface UseErrorHandlerOptions {
    onError?: (error: Error) => void;
    logErrors?: boolean;
}

export function useErrorHandler({
    onError,
    logErrors = true
}: UseErrorHandlerOptions = {}) {
    const [error, setError] = useState<Error | null>(null);

    const handleError = useCallback((error: Error | string) => {
        const errorObj = typeof error === 'string' ? new Error(error) : error;

        if (logErrors) {
            logger.error('Handled error:', errorObj);
        }

        setError(errorObj);
        onError?.(errorObj);
    }, [onError, logErrors]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    // Wrapper for async functions to catch errors
    const wrapAsync = useCallback(<T extends any[], R>(
        asyncFn: (...args: T) => Promise<R>
    ) => {
        return async (...args: T): Promise<R | void> => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                handleError(error as Error);
            }
        };
    }, [handleError]);

    // Wrapper for sync functions to catch errors
    const wrapSync = useCallback(<T extends any[], R>(
        syncFn: (...args: T) => R
    ) => {
        return (...args: T): R | void => {
            try {
                return syncFn(...args);
            } catch (error) {
                handleError(error as Error);
            }
        };
    }, [handleError]);

    return {
        error,
        handleError,
        clearError,
        resetError,
        wrapAsync,
        wrapSync,
    };
}
