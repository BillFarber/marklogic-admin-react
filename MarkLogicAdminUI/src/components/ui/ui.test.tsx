import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadingSpinner, ErrorMessage, EmptyState } from './index';

describe('UI Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<LoadingSpinner message="Fetching data..." />);

      expect(screen.getByText('Fetching data...')).toBeInTheDocument();
    });

    it('renders with custom size', () => {
      render(<LoadingSpinner size="large" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-12', 'h-12');
    });

    it('renders with custom className', () => {
      render(<LoadingSpinner className="custom-class" />);

      const container = screen.getByRole('status').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('ErrorMessage', () => {
    it('renders with string error', () => {
      render(<ErrorMessage error="Test error message" />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('renders with Error object', () => {
      const error = new Error('Network error');
      render(<ErrorMessage error={error} />);

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
      const mockRetry = vi.fn();
      render(<ErrorMessage error="Test error" onRetry={mockRetry} />);

      const retryButton = screen.getByText('Try again');
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(<ErrorMessage error="Test error" />);

      expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });
  });

  describe('EmptyState', () => {
    it('renders with title only', () => {
      render(<EmptyState title="No data available" />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders with title and description', () => {
      render(
        <EmptyState
          title="No data available"
          description="Try refreshing the page"
        />,
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByText('Try refreshing the page')).toBeInTheDocument();
    });

    it('renders action button when provided', () => {
      const mockAction = vi.fn();
      render(
        <EmptyState
          title="No data available"
          action={{ label: 'Refresh', onClick: mockAction }}
        />,
      );

      const actionButton = screen.getByText('Refresh');
      expect(actionButton).toBeInTheDocument();

      fireEvent.click(actionButton);
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('renders with custom className', () => {
      render(<EmptyState title="Test" className="custom-empty-state" />);

      const container = screen.getByText('Test').closest('div');
      expect(container).toHaveClass('custom-empty-state');
    });
  });
});
