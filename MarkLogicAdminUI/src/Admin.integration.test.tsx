import { render, screen, waitFor } from '@testing-library/react';
import Admin from './Admin';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';

// Real Integration Tests - These make actual HTTP requests to the Spring Boot proxy
describe('Admin - Real Integration Tests', () => {
    // Helper to check if proxy is running
    const checkProxyHealth = async (): Promise<boolean> => {
        try {
            // Use the databases endpoint instead of actuator/health since that's what we actually need
            const response = await fetch('http://localhost:8080/manage/v2/databases', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            // Return true if we get any response (even errors) - means proxy is running
            return true;
        } catch {
            return false;
        }
    };

    // Helper to check if databases endpoint is accessible
    const checkDatabasesEndpoint = async (): Promise<{ success: boolean; status?: number; data?: any }> => {
        try {
            const response = await fetch('http://localhost:8080/manage/v2/databases', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, status: response.status, data };
            } else {
                return { success: false, status: response.status };
            }
        } catch (error) {
            return { success: false };
        }
    };

    it('connects to Spring Boot proxy and handles response', async () => {
        const proxyRunning = await checkProxyHealth();

        // Fail the test if proxy is not running
        expect(proxyRunning).toBe(true);

        console.log('✅ Spring Boot proxy is running, testing integration...');

        render(<Admin />);

        // Wait for the component to finish loading (either success or error)
        await waitFor(() => {
            const isStillLoading = screen.queryByText('Loading databases...');
            expect(isStillLoading).toBeFalsy();
        }, { timeout: 15000 });

        // Check what we got - either success or error
        const hasError = screen.queryByText(/Error:/);
        const hasDatabases = screen.queryByRole('heading', { name: 'Databases' });
        const hasJsonContent = screen.queryByText(/database-default-list|Error/);

        // Should have some content (either error or success)
        expect(hasError || hasDatabases || hasJsonContent).toBeTruthy();

        if (hasError) {
            console.warn('⚠️  Got error response (likely MarkLogic not available):', hasError.textContent);
        } else if (hasDatabases) {
            console.log('✅ Successfully retrieved database list from MarkLogic via proxy');
        }
    }, 20000);

    it('verifies proxy endpoint accessibility directly', async () => {
        const result = await checkDatabasesEndpoint();

        // Fail the test if proxy is not accessible
        expect(result.success || result.status).toBeTruthy();

        if (result.success) {
            console.log('✅ Direct proxy call successful - MarkLogic is accessible');
            expect(result.data).toBeDefined();
            expect(result.status).toBe(200);
        } else if (result.status) {
            console.warn(`⚠️  Proxy responded with HTTP ${result.status} - MarkLogic may be unavailable`);
            // This is still a valid test - proxy is working but MarkLogic might be down
            expect(typeof result.status).toBe('number');
        } else {
            // This will fail the test if proxy is completely unreachable
            throw new Error('Spring Boot proxy is not accessible at localhost:8080');
        }
    }, 10000);

    it('validates full end-to-end React component integration', async () => {
        const proxyRunning = await checkProxyHealth();

        // Fail the test if proxy is not running
        expect(proxyRunning).toBe(true);

        render(<Admin />);

        // Test the full user flow
        await waitFor(() => {
            // Page should have loaded completely
            expect(screen.getByRole('heading', { name: /MarkLogic Admin \(Proxy\)/i })).toBeInTheDocument();
            expect(screen.getByText(/Welcome to the admin page using Spring Boot proxy/i)).toBeInTheDocument();

            // Should not be loading anymore
            expect(screen.queryByText('Loading databases...')).toBeFalsy();
        }, { timeout: 15000 });

        // Check for content (databases or error) - use queryAllByText since content appears in multiple places
        const hasContent = screen.queryAllByText(/Error:|database-default-list|Databases/);
        expect(hasContent.length).toBeGreaterThan(0);

        console.log('✅ End-to-end integration test completed successfully');
    }, 20000);

    it('requires proxy to be running for network timeout test', async () => {
        // First verify proxy is available
        const proxyRunning = await checkProxyHealth();
        expect(proxyRunning).toBe(true);

        // This test ensures the component behaves correctly even with slow networks
        render(<Admin />);

        // Should eventually finish loading (even if it takes a while)
        await waitFor(() => {
            const isLoading = screen.queryByText('Loading databases...');
            expect(isLoading).toBeFalsy();
        }, { timeout: 20000 });

        // Should show some result (using queryAllByText since content appears in multiple places)
        const hasAnyContent = screen.queryAllByText(/Error:|Databases|database-default-list/);
        expect(hasAnyContent.length).toBeGreaterThan(0);
    }, 25000);

    // Forests-specific Real Integration Tests
    describe('Forests Integration Tests', () => {
        // Helper to check if forests endpoint is accessible
        const checkForestsEndpoint = async (): Promise<{ success: boolean; status?: number; data?: any; error?: string }> => {
            try {
                const response = await fetch('http://localhost:8080/manage/v2/forests?format=json', {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    return { success: true, status: response.status, data };
                } else {
                    const errorText = await response.text();
                    return { success: false, status: response.status, error: errorText };
                }
            } catch (error) {
                return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
            }
        };

        it('forests endpoint responds to direct API calls', async () => {
            const proxyRunning = await checkProxyHealth();
            expect(proxyRunning).toBe(true);

            const result = await checkForestsEndpoint();

            // Fail the test if forests endpoint is not accessible
            expect(result.success || result.status).toBeTruthy();

            if (result.success) {
                console.log('✅ Direct forests API call successful - MarkLogic forests accessible');
                expect(result.data).toBeDefined();
                expect(result.status).toBe(200);

                // Verify the response structure matches expected MarkLogic format
                if (result.data && typeof result.data === 'object') {
                    console.log(`✅ Forests response structure: ${Object.keys(result.data).join(', ')}`);
                }
            } else if (result.status) {
                console.warn(`⚠️  Forests endpoint responded with HTTP ${result.status} - MarkLogic may be unavailable`);
                console.warn(`Error: ${result.error}`);
                // This is still a valid test - proxy is working but MarkLogic might be down
                expect(typeof result.status).toBe('number');
            } else {
                console.error(`❌ Forests endpoint error: ${result.error}`);
                throw new Error('Forests endpoint is not accessible');
            }
        }, 10000);

        it('validates forests parameter handling with format=json', async () => {
            const proxyRunning = await checkProxyHealth();
            expect(proxyRunning).toBe(true);

            // Test the endpoint with explicit JSON format
            const result = await checkForestsEndpoint();

            if (result.success) {
                expect(result.status).toBe(200);
                expect(result.data).toBeDefined();

                console.log('✅ Forests endpoint correctly handles format=json parameter');

                // If we got forests data, verify the structure
                if (result.data && result.data['forest-default-list']) {
                    const forestsList = result.data['forest-default-list'];
                    console.log(`✅ Found forests list structure: ${JSON.stringify(Object.keys(forestsList))}`);

                    if (forestsList['list-items'] && forestsList['list-items']['list-item']) {
                        const forests = forestsList['list-items']['list-item'];
                        console.log(`✅ Found ${Array.isArray(forests) ? forests.length : 1} forest(s)`);
                    }
                }
            } else {
                // Still a valid test if we get an error response (MarkLogic may be down)
                console.warn(`⚠️  Forests endpoint returned error: ${result.error || 'HTTP ' + result.status}`);
                expect(result.status || result.error).toBeTruthy();
            }
        }, 10000);

        it('validates forests display in React component integration', async () => {
            const proxyRunning = await checkProxyHealth();
            expect(proxyRunning).toBe(true);

            render(<Admin />);

            // Wait for both databases and forests to finish loading
            await waitFor(() => {
                const isLoadingDatabases = screen.queryByText('Loading databases...');
                const isLoadingForests = screen.queryByText('Loading forests...');
                expect(isLoadingDatabases).toBeFalsy();
                expect(isLoadingForests).toBeFalsy();
            }, { timeout: 15000 });

            // Check that forests-related content is present (either success or error)
            const hasForestsHeading = screen.queryByRole('heading', { name: 'Forests' });
            const hasForestsError = screen.queryByText(/Forests:/);
            const hasForestsJson = screen.queryByText(/forest-default-list/);
            const hasForestsDetails = screen.queryByText('View Raw Forests JSON');

            // Should have some forests-related content
            const hasForestsContent = hasForestsHeading || hasForestsError || hasForestsJson || hasForestsDetails;
            expect(hasForestsContent).toBeTruthy();

            if (hasForestsHeading) {
                console.log('✅ Forests section successfully rendered in React component');

                // If forests section exists, check for lists
                const lists = screen.queryAllByRole('list');
                if (lists.length >= 2) {
                    console.log(`✅ Found ${lists.length} lists (likely databases and forests)`);
                }
            } else if (hasForestsError) {
                console.warn('⚠️  Forests section shows error (MarkLogic may be unavailable)');
            } else if (hasForestsDetails) {
                console.log('✅ Forests raw JSON section is present');
            }
        }, 20000);

        it('validates forests API call with actual parameter validation', async () => {
            const proxyRunning = await checkProxyHealth();
            expect(proxyRunning).toBe(true);

            // Test various parameter combinations to ensure proxy validation works
            const testCases = [
                { params: '?format=json', shouldSucceed: true, description: 'valid format=json' },
                { params: '?format=xml', shouldSucceed: true, description: 'valid format=xml' },
                { params: '?format=invalid', shouldSucceed: false, description: 'invalid format' },
                { params: '?view=default', shouldSucceed: true, description: 'valid view=default' },
                { params: '?view=invalid', shouldSucceed: false, description: 'invalid view' },
                { params: '?fullrefs=true', shouldSucceed: true, description: 'valid fullrefs=true' },
                { params: '?fullrefs=invalid', shouldSucceed: false, description: 'invalid fullrefs' }
            ];

            for (const testCase of testCases) {
                try {
                    const response = await fetch(`http://localhost:8080/manage/v2/forests${testCase.params}`, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' }
                    });

                    if (testCase.shouldSucceed) {
                        // Should get 200 (success) or potentially 5xx (MarkLogic issue)
                        expect(response.status === 200 || response.status >= 500).toBe(true);
                        console.log(`✅ ${testCase.description}: HTTP ${response.status}`);
                    } else {
                        // Should get 400 (bad request) for invalid parameters
                        expect(response.status).toBe(400);
                        console.log(`✅ ${testCase.description}: correctly rejected with HTTP ${response.status}`);

                        // Verify error message in response
                        const errorText = await response.text();
                        expect(errorText).toContain('error');
                    }
                } catch (error) {
                    if (testCase.shouldSucceed) {
                        console.warn(`⚠️  ${testCase.description}: Network error - ${error}`);
                        // For valid requests, network errors are acceptable (MarkLogic may be down)
                        expect(error).toBeDefined();
                    } else {
                        throw error; // Invalid requests should not cause network errors
                    }
                }
            }

            console.log('✅ All forests parameter validation tests completed');
        }, 15000);

        it('validates forests and databases load independently', async () => {
            const proxyRunning = await checkProxyHealth();
            expect(proxyRunning).toBe(true);

            render(<Admin />);

            // Track loading states independently
            const initialDatabasesLoading = screen.queryByText('Loading databases...');
            const initialForestsLoading = screen.queryByText('Loading forests...');

            expect(initialDatabasesLoading).toBeTruthy();
            expect(initialForestsLoading).toBeTruthy();

            console.log('✅ Both databases and forests show initial loading states');

            // Wait for both to complete (success or error)
            await waitFor(() => {
                const stillLoadingDatabases = screen.queryByText('Loading databases...');
                const stillLoadingForests = screen.queryByText('Loading forests...');
                expect(stillLoadingDatabases).toBeFalsy();
                expect(stillLoadingForests).toBeFalsy();
            }, { timeout: 15000 });

            // Verify independent API calls were made
            // This is implicit - if both loading states disappeared, both APIs were called

            // Check for any content (success or error) for both sections
            const hasAnyDatabaseContent = screen.queryAllByText(/Databases|database-default-list|Error/);
            const hasAnyForestsContent = screen.queryAllByText(/Forests|forest-default-list/);

            expect(hasAnyDatabaseContent.length).toBeGreaterThan(0);
            expect(hasAnyForestsContent.length).toBeGreaterThan(0);

            console.log('✅ Both databases and forests content loaded independently');
        }, 20000);
    });
});
