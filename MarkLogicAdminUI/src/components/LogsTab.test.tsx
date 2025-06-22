import { render, screen } from '@testing-library/react';
import { LogsTab } from './LogsTab';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('LogsTab', () => {
    it('should render loading state', () => {
        render(<LogsTab logs={null} error={null} loading={true} />);
        expect(screen.getByText('Loading logs...')).toBeInTheDocument();
    });

    it('should render error state', () => {
        const errorMessage = 'Failed to fetch logs';
        render(<LogsTab logs={null} error={errorMessage} loading={false} />);
        expect(screen.getByText(`Error loading logs: ${errorMessage}`)).toBeInTheDocument();
    });

    it('should render no logs state', () => {
        render(<LogsTab logs={null} error={null} loading={false} />);
        expect(screen.getByText('No logs available')).toBeInTheDocument();
    });

    it('should render logs content when data is available', () => {
        const logContent = 'Sample log content\nSecond line';
        render(<LogsTab logs={logContent} error={null} loading={false} />);

        expect(screen.getByText('📋 Error Logs (ErrorLog.txt)')).toBeInTheDocument();
        expect(screen.getByText((content, element) => content.includes('Sample log content'))).toBeInTheDocument();
        expect(screen.getByText((content, element) => content.includes('Second line'))).toBeInTheDocument();
        expect(screen.getByText(/📅 Last updated:/)).toBeInTheDocument();
    });

    it('should render JSON logs correctly', () => {
        const logData = { level: 'ERROR', message: 'Test error' };
        render(<LogsTab logs={logData} error={null} loading={false} />);

        expect(screen.getByText('📋 Error Logs (ErrorLog.txt)')).toBeInTheDocument();
        expect(screen.getByText((content, element) => content.includes('"level": "ERROR"'))).toBeInTheDocument();
        expect(screen.getByText((content, element) => content.includes('"message": "Test error"'))).toBeInTheDocument();
    });
});
