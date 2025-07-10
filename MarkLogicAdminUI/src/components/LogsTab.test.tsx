import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogsTab } from './LogsTab';
import '@testing-library/jest-dom';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('LogsTab Dropdown Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch and display log files list on mount', async () => {
    // Mock the log files list response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        'log-files': ['ErrorLog.txt', 'AuditLog.txt', 'CrashLog.txt'],
      }),
    });

    // Mock the initial log content response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Sample error log content',
    });

    render(<LogsTab logs={null} error={null} loading={false} />);

    // Should show loading state initially
    expect(
      screen.getByText('Loading available log files...'),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('ErrorLog.txt')).toBeInTheDocument();
    });

    // Check that the dropdown contains the fetched files
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();

    // Check that all files are in the dropdown
    expect(
      screen.getByRole('option', { name: 'ErrorLog.txt' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'AuditLog.txt' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'CrashLog.txt' }),
    ).toBeInTheDocument();

    // Should show file count
    expect(screen.getByText('(3 files available)')).toBeInTheDocument();

    // Verify the API calls
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      'http://localhost:8080/manage/v2/logs?format=json',
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'application/json' },
      }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:8080/manage/v2/logs?filename=ErrorLog.txt&format=text',
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'text/plain' },
      }),
    );
  });

  it('should handle file selection changes', async () => {
    // Mock the log files list response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        'log-files': ['ErrorLog.txt', 'AuditLog.txt', 'AccessLog.txt'],
      }),
    });

    // Mock the initial log content response (ErrorLog.txt)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Error log content',
    });

    // Mock the second log content response (AuditLog.txt)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Audit log content',
    });

    render(<LogsTab logs={null} error={null} loading={false} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('ErrorLog.txt')).toBeInTheDocument();
    });

    // Change selection to AuditLog.txt
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'AuditLog.txt' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('AuditLog.txt')).toBeInTheDocument();
    });

    // Should have called fetch for the new file
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenNthCalledWith(
      3,
      'http://localhost:8080/manage/v2/logs?filename=AuditLog.txt&format=text',
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'text/plain' },
      }),
    );
  });

  it('should use fallback list when API fails', async () => {
    // Mock failed log files list response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    // Mock the initial log content response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Sample error log content',
    });

    render(<LogsTab logs={null} error={null} loading={false} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('ErrorLog.txt')).toBeInTheDocument();
    });

    // Should show warning about using fallback
    expect(
      screen.getByText(/Warning:.*using fallback list/),
    ).toBeInTheDocument();

    // Should still have the fallback files in dropdown
    expect(
      screen.getByRole('option', { name: 'ErrorLog.txt' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'AuditLog.txt' }),
    ).toBeInTheDocument();
    expect(screen.getByText('(5 files available)')).toBeInTheDocument();
  });

  it('should handle accessibility features', async () => {
    // Mock the log files list response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        'log-files': ['ErrorLog.txt', 'AuditLog.txt'],
      }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Log content',
    });

    render(<LogsTab logs={null} error={null} loading={false} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('ErrorLog.txt')).toBeInTheDocument();
    });

    // Check dropdown accessibility
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toHaveAttribute('id', 'logfile-select');

    const label = screen.getByLabelText('Log File:');
    expect(label).toBeInTheDocument();
    expect(label).toBe(dropdown);
  });

  it('should handle log type in title based on selected file', async () => {
    // Mock the log files list response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        'log-files': ['ErrorLog.txt', 'AccessLog.txt', 'AuditLog.txt'],
      }),
    });

    // Mock log content responses
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => 'Log content',
    });

    render(<LogsTab logs={null} error={null} loading={false} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('ErrorLog.txt')).toBeInTheDocument();
    });

    // Check Error log title
    expect(
      screen.getByText(/Error Logs \(ErrorLog\.txt\)/),
    ).toBeInTheDocument();

    // Change to Access log
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'AccessLog.txt' } });

    await waitFor(() => {
      expect(
        screen.getByText(/Access Logs \(AccessLog\.txt\)/),
      ).toBeInTheDocument();
    });

    // Change to Audit log
    fireEvent.change(dropdown, { target: { value: 'AuditLog.txt' } });

    await waitFor(() => {
      expect(
        screen.getByText(/Audit Logs \(AuditLog\.txt\)/),
      ).toBeInTheDocument();
    });
  });
});
