import { render, screen, waitFor } from '@testing-library/react';
import Admin from './Admin';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('Admin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders MarkLogic Admin title and welcome message', () => {
        // Mock fetch to return a pending promise to avoid API call
        (fetch as any).mockReturnValue(new Promise(() => { }));

        render(<Admin />);
        expect(screen.getByRole('heading', { name: /MarkLogic Admin \(Proxy\)/i })).toBeInTheDocument();
        expect(screen.getByText(/Welcome to the admin page using Spring Boot proxy/i)).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
        // Mock fetch to return a pending promise
        (fetch as any).mockReturnValue(new Promise(() => { }));

        render(<Admin />);
        expect(screen.getByText('Loading databases...')).toBeInTheDocument();
        expect(screen.getByText('Loading forests...')).toBeInTheDocument();
    });

    it('makes a request to the Spring Boot proxy on mount', () => {
        // Mock fetch to return a pending promise
        (fetch as any).mockReturnValue(new Promise(() => { }));

        render(<Admin />);

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/manage/v2/databases',
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            }
        );

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/manage/v2/forests?format=json',
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            }
        );
    });

    it('displays database names list when API call succeeds', async () => {
        const mockDatabasesResponse = {
            'database-default-list': {
                'list-items': {
                    'list-item': [
                        { nameref: 'Documents' },
                        { nameref: 'Security' },
                        { nameref: 'App-Services' },
                        { nameref: 'Meters' }
                    ]
                }
            }
        };

        // Mock both database and forest responses
        (fetch as any)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockDatabasesResponse)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ 'forest-default-list': { 'list-items': { 'list-item': [] } } })
            });

        render(<Admin />);

        // Wait for the API call to complete and component to update
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
        });

        // Check that database names are displayed in the list
        expect(screen.getByText('Documents')).toBeInTheDocument();
        expect(screen.getByText('Security')).toBeInTheDocument();
        expect(screen.getByText('App-Services')).toBeInTheDocument();
        expect(screen.getByText('Meters')).toBeInTheDocument();

        // Check that the databases JSON details section exists
        expect(screen.getByText('View Raw Databases JSON')).toBeInTheDocument();
    });

    it('displays error message when API call fails with HTTP error', async () => {
        (fetch as any).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        });

        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByText(/Error: HTTP 500: Internal Server Error/)).toBeInTheDocument();
        });

        // Should not show loading or databases content
        expect(screen.queryByText('Loading databases...')).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Databases' })).not.toBeInTheDocument();
    });

    it('displays error message when API call fails with network error', async () => {
        (fetch as any).mockRejectedValue(new Error('Network error'));

        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByText(/Error:.*Network error.*Forests:.*Network error/)).toBeInTheDocument();
        });

        // Should not show loading or databases content
        expect(screen.queryByText('Loading databases...')).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Databases' })).not.toBeInTheDocument();
    });

    it('handles empty database list gracefully', async () => {
        const mockEmptyResponse = {
            'database-default-list': {
                'list-items': {
                    'list-item': []
                }
            }
        };

        // Mock both endpoints
        (fetch as any)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockEmptyResponse)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ 'forest-default-list': { 'list-items': { 'list-item': [] } } })
            });

        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
        });

        // Should show databases section but with empty list
        const databasesList = screen.getAllByRole('list')[0]; // First list should be databases
        expect(databasesList).toBeInTheDocument();
        expect(databasesList.children).toHaveLength(0);
    });

    it('filters out database items without nameref', async () => {
        const mockResponseWithMixedData = {
            'database-default-list': {
                'list-items': {
                    'list-item': [
                        { nameref: 'Documents' },
                        { someOtherField: 'value' }, // No nameref
                        { nameref: 'Security' },
                        { id: '123' } // No nameref
                    ]
                }
            }
        };

        // Mock both endpoints
        (fetch as any)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponseWithMixedData)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ 'forest-default-list': { 'list-items': { 'list-item': [] } } })
            });

        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
        });

        // Should only show items with nameref
        expect(screen.getByText('Documents')).toBeInTheDocument();
        expect(screen.getByText('Security')).toBeInTheDocument();

        const databasesList = screen.getAllByRole('list')[0]; // First list should be databases
        expect(databasesList.children).toHaveLength(2);
    });

    it('handles malformed API response gracefully', async () => {
        const mockMalformedResponse = {
            'some-other-structure': 'value'
        };

        // Mock both endpoints with malformed responses
        (fetch as any)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockMalformedResponse)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockMalformedResponse)
            });

        render(<Admin />);

        await waitFor(() => {
            // Should show the databases details section
            expect(screen.getByText('View Raw Databases JSON')).toBeInTheDocument();
        });

        // Should not show databases section for malformed data
        expect(screen.queryByRole('heading', { name: 'Databases' })).not.toBeInTheDocument();
    });

    it('sets document title on mount', () => {
        (fetch as any).mockReturnValue(new Promise(() => { }));

        render(<Admin />);

        expect(document.title).toBe('MarkLogic Admin');
    });

    // Forests-specific tests
    describe('Forests functionality', () => {
        it('makes a request to the forests endpoint with JSON format on mount', () => {
            // Mock fetch to return a pending promise
            (fetch as any).mockReturnValue(new Promise(() => { }));

            render(<Admin />);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/forests?format=json',
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                }
            );
        });

        it('displays forests list when API call succeeds', async () => {
            const mockForestsResponse = {
                'forest-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents-forest' },
                            { nameref: 'Security-forest' },
                            { nameref: 'App-Services-forest' },
                            { nameref: 'Meters-forest' }
                        ]
                    }
                }
            };

            // Mock successful responses for both endpoints
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockForestsResponse)
                });

            render(<Admin />);

            // Wait for the forests API call to complete and component to update
            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Check that forest names are displayed in the list
            expect(screen.getByText('Documents-forest')).toBeInTheDocument();
            expect(screen.getByText('Security-forest')).toBeInTheDocument();
            expect(screen.getByText('App-Services-forest')).toBeInTheDocument();
            expect(screen.getByText('Meters-forest')).toBeInTheDocument();

            // Check that the forests JSON is also displayed in the details section
            expect(screen.getByText(/"forest-default-list"/)).toBeInTheDocument();
        });

        it('shows loading state for forests initially', () => {
            // Mock fetch to return a pending promise
            (fetch as any).mockReturnValue(new Promise(() => { }));

            render(<Admin />);
            expect(screen.getByText('Loading forests...')).toBeInTheDocument();
        });

        it('displays error message when forests API call fails with HTTP error', async () => {
            // Mock databases success, forests failure
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: false,
                    status: 404,
                    statusText: 'Not Found'
                });

            render(<Admin />);

            await waitFor(() => {
                expect(screen.getByText(/Error:.*Forests: HTTP 404: Not Found/)).toBeInTheDocument();
            });

            // Should not show loading or forests content
            expect(screen.queryByText('Loading forests...')).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Forests' })).not.toBeInTheDocument();
        });

        it('displays error message when forests API call fails with network error', async () => {
            // Mock databases success, forests network failure
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockRejectedValueOnce(new Error('Connection timeout'));

            render(<Admin />);

            await waitFor(() => {
                expect(screen.getByText(/Forests: Connection timeout/)).toBeInTheDocument();
            });

            // Should not show loading or forests content
            expect(screen.queryByText('Loading forests...')).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Forests' })).not.toBeInTheDocument();
        });

        it('handles empty forests list gracefully', async () => {
            const mockEmptyForestsResponse = {
                'forest-default-list': {
                    'list-items': {
                        'list-item': []
                    }
                }
            };

            // Mock responses for both endpoints
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockEmptyForestsResponse)
                });

            render(<Admin />);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Should show forests section but with empty list
            const forestsLists = screen.getAllByRole('list');
            const forestsList = forestsLists.find(list =>
                list.style.background === 'rgb(42, 77, 58)' // Green background for forests
            );
            expect(forestsList).toBeInTheDocument();
            expect(forestsList?.children).toHaveLength(0);
        });

        it('filters out forest items without nameref', async () => {
            const mockResponseWithMixedData = {
                'forest-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents-forest' },
                            { someOtherField: 'value' }, // No nameref
                            { nameref: 'Security-forest' },
                            { id: '456' } // No nameref
                        ]
                    }
                }
            };

            // Mock responses for both endpoints
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockResponseWithMixedData)
                });

            render(<Admin />);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Should only show forest items with nameref
            expect(screen.getByText('Documents-forest')).toBeInTheDocument();
            expect(screen.getByText('Security-forest')).toBeInTheDocument();

            const forestsLists = screen.getAllByRole('list');
            const forestsList = forestsLists.find(list =>
                list.style.background === 'rgb(42, 77, 58)' // Green background for forests
            );
            expect(forestsList?.children).toHaveLength(2);
        });

        it('handles malformed forests API response gracefully', async () => {
            const mockMalformedForestsResponse = {
                'some-other-forest-structure': 'value'
            };

            // Mock responses for both endpoints
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockMalformedForestsResponse)
                });

            render(<Admin />);

            await waitFor(() => {
                // Should show the JSON but not the forests list
                expect(screen.getByText(/"some-other-forest-structure"/)).toBeInTheDocument();
            });

            // Should not show forests section for malformed data
            expect(screen.queryByRole('heading', { name: 'Forests' })).not.toBeInTheDocument();
        });
    });

    // Integration tests for both databases and forests
    describe('Integration tests', () => {
        it('displays both databases and forests when both API calls succeed', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents' },
                            { nameref: 'Security' }
                        ]
                    }
                }
            };

            const mockForestsResponse = {
                'forest-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents-forest' },
                            { nameref: 'Security-forest' }
                        ]
                    }
                }
            };

            // Mock successful responses for both endpoints
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDatabasesResponse)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockForestsResponse)
                });

            render(<Admin />);

            // Wait for both API calls to complete
            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Check databases are displayed
            expect(screen.getByText('Documents')).toBeInTheDocument();
            expect(screen.getByText('Security')).toBeInTheDocument();

            // Check forests are displayed
            expect(screen.getByText('Documents-forest')).toBeInTheDocument();
            expect(screen.getByText('Security-forest')).toBeInTheDocument();

            // Check both detail sections are present
            expect(screen.getByText('View Raw Databases JSON')).toBeInTheDocument();
            expect(screen.getByText('View Raw Forests JSON')).toBeInTheDocument();
        });

        it('handles mixed success/failure scenarios gracefully', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [{ nameref: 'Documents' }]
                    }
                }
            };

            // Mock databases success, forests failure
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDatabasesResponse)
                })
                .mockRejectedValueOnce(new Error('Forests service unavailable'));

            render(<Admin />);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Should show databases but error for forests
            expect(screen.getByText('Documents')).toBeInTheDocument();
            expect(screen.getByText(/Forests: Forests service unavailable/)).toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Forests' })).not.toBeInTheDocument();
        });

        it('calls both API endpoints independently on mount', () => {
            (fetch as any).mockReturnValue(new Promise(() => { }));

            render(<Admin />);

            // Should make calls to both endpoints
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/forests?format=json',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
        });

        it('accumulates error messages from both endpoints', async () => {
            // Mock both endpoints to fail
            (fetch as any)
                .mockRejectedValueOnce(new Error('Database connection failed'))
                .mockRejectedValueOnce(new Error('Forest connection failed'));

            render(<Admin />);

            await waitFor(() => {
                const errorElement = screen.getByText(/Error:/);
                expect(errorElement.textContent).toContain('Database connection failed');
                expect(errorElement.textContent).toContain('Forest connection failed');
            });
        });
    });
});
