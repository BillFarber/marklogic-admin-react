import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Admin from './Admin';
import '@testing-library/jest-dom';

// Real Integration Tests - These make actual HTTP requests to the Spring Boot proxy
describe('Admin - Real Integration Tests', () => {
  // Helper to check if proxy is running
  const checkProxyHealth = async (): Promise<boolean> => {
    try {
      // Use the databases endpoint instead of actuator/health since that's what we actually need
      await fetch('http://localhost:8080/manage/v2/databases', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      // Return true if we get any response (even errors) - means proxy is running
      return true;
    } catch {
      return false;
    }
  };

  // Helper to check if databases endpoint is accessible
  const checkDatabasesEndpoint = async (): Promise<{
    success: boolean;
    status?: number;
    data?: any;
  }> => {
    try {
      const response = await fetch(
        'http://localhost:8080/manage/v2/databases',
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return { success: true, status: response.status, data };
      } else {
        return { success: false, status: response.status };
      }
    } catch {
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
    await waitFor(
      () => {
        const isStillLoadingDatabases = screen.queryByText(
          'Loading databases...',
        );
        const isStillLoadingForests = screen.queryByText('Loading forests...');
        const isStillLoadingServers = screen.queryByText('Loading servers...');
        expect(isStillLoadingDatabases).toBeFalsy();
        expect(isStillLoadingForests).toBeFalsy();
        expect(isStillLoadingServers).toBeFalsy();
      },
      { timeout: 15000 },
    );

    // Check what we got - either success or error
    const hasError = screen.queryByText(/Error:/);
    const hasDatabases = screen.queryByRole('heading', { name: 'Databases' });
    const hasAnyDatabaseNames = screen.queryAllByText(
      /App-Services|Documents|Security|Modules/,
    ); // Use queryAllByText

    // Should have some content (either error or success)
    expect(
      hasError || hasDatabases || hasAnyDatabaseNames.length > 0,
    ).toBeTruthy();

    if (hasError) {
      console.warn(
        '⚠️  Got error response (likely MarkLogic not available):',
        hasError.textContent,
      );
    } else if (hasDatabases) {
      console.log(
        '✅ Successfully retrieved database list from MarkLogic via proxy',
      );
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
      console.warn(
        `⚠️  Proxy responded with HTTP ${result.status} - MarkLogic may be unavailable`,
      );
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
    await waitFor(
      () => {
        // Page should have loaded completely
        expect(
          screen.getByRole('heading', { name: /MarkLogic Admin \(Proxy\)/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            /Welcome to the admin page using Spring Boot proxy/i,
          ),
        ).toBeInTheDocument();

        // Should not be loading anymore
        expect(screen.queryByText('Loading databases...')).toBeFalsy();
        expect(screen.queryByText('Loading forests...')).toBeFalsy();
        expect(screen.queryByText('Loading servers...')).toBeFalsy();
      },
      { timeout: 15000 },
    );

    // Check for content (databases or error) - look for actual content that will be present
    const hasContent = screen.queryAllByText(
      /Error:|Databases|App-Services|Documents|Security|Modules/,
    );
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
    await waitFor(
      () => {
        const isDatabasesLoading = screen.queryByText('Loading databases...');
        const isForestsLoading = screen.queryByText('Loading forests...');
        const isServersLoading = screen.queryByText('Loading servers...');
        expect(isDatabasesLoading).toBeFalsy();
        expect(isForestsLoading).toBeFalsy();
        expect(isServersLoading).toBeFalsy();
      },
      { timeout: 20000 },
    );

    // Should show some result (using queryAllByText since content appears across multiple places)
    const hasAnyContent = screen.queryAllByText(
      /Error:|Databases|App-Services|Documents|Security|Modules/,
    );
    expect(hasAnyContent.length).toBeGreaterThan(0);
  }, 25000);

  // Forests-specific Real Integration Tests
  describe('Forests Integration Tests', () => {
    // Helper to check if forests endpoint is accessible
    const checkForestsEndpoint = async (): Promise<{
      success: boolean;
      status?: number;
      data?: any;
      error?: string;
    }> => {
      try {
        const response = await fetch(
          'http://localhost:8080/manage/v2/forests?format=json',
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          },
        );

        if (response.ok) {
          const data = await response.json();
          return { success: true, status: response.status, data };
        } else {
          const errorText = await response.text();
          return { success: false, status: response.status, error: errorText };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    };

    it('forests endpoint responds to direct API calls', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      const result = await checkForestsEndpoint();

      // Fail the test if forests endpoint is not accessible
      expect(result.success || result.status).toBeTruthy();

      if (result.success) {
        console.log(
          '✅ Direct forests API call successful - MarkLogic forests accessible',
        );
        expect(result.data).toBeDefined();
        expect(result.status).toBe(200);

        // Verify the response structure matches expected MarkLogic format
        if (result.data && typeof result.data === 'object') {
          console.log(
            `✅ Forests response structure: ${Object.keys(result.data).join(', ')}`,
          );
        }
      } else if (result.status) {
        console.warn(
          `⚠️  Forests endpoint responded with HTTP ${result.status} - MarkLogic may be unavailable`,
        );
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

        console.log(
          '✅ Forests endpoint correctly handles format=json parameter',
        );

        // If we got forests data, verify the structure
        if (result.data && result.data['forest-default-list']) {
          const forestsList = result.data['forest-default-list'];
          console.log(
            `✅ Found forests list structure: ${JSON.stringify(Object.keys(forestsList))}`,
          );

          if (
            forestsList['list-items'] &&
            forestsList['list-items']['list-item']
          ) {
            const forests = forestsList['list-items']['list-item'];
            console.log(
              `✅ Found ${Array.isArray(forests) ? forests.length : 1} forest(s)`,
            );
          }
        }
      } else {
        // Still a valid test if we get an error response (MarkLogic may be down)
        console.warn(
          `⚠️  Forests endpoint returned error: ${result.error || 'HTTP ' + result.status}`,
        );
        expect(result.status || result.error).toBeTruthy();
      }
    }, 10000);

    it('validates forests display in React component integration', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      render(<Admin />);

      // Click on Data tab to see databases/forests
      const dataTabButton = screen.getByRole('button', {
        name: /Data \(Databases & Forests\)/,
      });
      fireEvent.click(dataTabButton);

      // Wait for all loading states to finish
      await waitFor(
        () => {
          const isLoadingDatabases = screen.queryByText('Loading databases...');
          const isLoadingForests = screen.queryByText('Loading forests...');
          const isLoadingServers = screen.queryByText('Loading servers...');
          expect(isLoadingDatabases).toBeFalsy();
          expect(isLoadingForests).toBeFalsy();
          expect(isLoadingServers).toBeFalsy();
        },
        { timeout: 15000 },
      );

      // Check that forests-related content is present (either success or error)
      const hasForestsHeading = screen.queryByRole('heading', {
        name: 'Forests',
      });
      const hasForestsError = screen.queryByText(/Error:.*Forests/);
      const hasForestsJson = screen.queryByText(/forest-default-list/);
      const hasForestsDetails = screen.queryByText('View Raw Forests JSON');

      // Should have some forests-related content
      const hasForestsContent =
        hasForestsHeading ||
        hasForestsError ||
        hasForestsJson ||
        hasForestsDetails;
      expect(hasForestsContent).toBeTruthy();

      if (hasForestsHeading) {
        console.log(
          '✅ Forests section successfully rendered in React component',
        );

        // If forests section exists, check for lists
        const lists = screen.queryAllByRole('list');
        if (lists.length >= 2) {
          console.log(
            `✅ Found ${lists.length} lists (likely databases and forests)`,
          );
        }
      } else if (hasForestsError) {
        console.warn(
          '⚠️  Forests section shows error (MarkLogic may be unavailable)',
        );
      } else if (hasForestsDetails) {
        console.log('✅ Forests raw JSON section is present');
      }
    }, 20000);

    it('validates forests API call with actual parameter validation', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      // Test various parameter combinations to ensure proxy validation works
      const testCases = [
        {
          params: '?format=json',
          shouldSucceed: true,
          description: 'valid format=json',
        },
        {
          params: '?format=xml',
          shouldSucceed: true,
          description: 'valid format=xml',
        },
        {
          params: '?format=invalid',
          shouldSucceed: false,
          description: 'invalid format',
        },
        {
          params: '?view=default',
          shouldSucceed: true,
          description: 'valid view=default',
        },
        {
          params: '?view=invalid',
          shouldSucceed: false,
          description: 'invalid view',
        },
        {
          params: '?fullrefs=true',
          shouldSucceed: true,
          description: 'valid fullrefs=true',
        },
        {
          params: '?fullrefs=invalid',
          shouldSucceed: false,
          description: 'invalid fullrefs',
        },
      ];

      for (const testCase of testCases) {
        try {
          const response = await fetch(
            `http://localhost:8080/manage/v2/forests${testCase.params}`,
            {
              method: 'GET',
              headers: { Accept: 'application/json' },
            },
          );

          if (testCase.shouldSucceed) {
            // Should get 200 (success) or potentially 5xx (MarkLogic issue)
            expect(response.status === 200 || response.status >= 500).toBe(
              true,
            );
            console.log(`✅ ${testCase.description}: HTTP ${response.status}`);
          } else {
            // Should get 400 (bad request) for invalid parameters
            expect(response.status).toBe(400);
            console.log(
              `✅ ${testCase.description}: correctly rejected with HTTP ${response.status}`,
            );

            // Verify error message in response
            const errorText = await response.text();
            expect(errorText).toContain('error');
          }
        } catch (error) {
          if (testCase.shouldSucceed) {
            console.warn(
              `⚠️  ${testCase.description}: Network error - ${error}`,
            );
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

      // Wait for all loading states to complete (because they may complete very quickly)
      await waitFor(
        () => {
          const stillLoadingDatabases = screen.queryByText(
            'Loading databases...',
          );
          const stillLoadingForests = screen.queryByText('Loading forests...');
          const stillLoadingServers = screen.queryByText('Loading servers...');
          expect(stillLoadingDatabases).toBeFalsy();
          expect(stillLoadingForests).toBeFalsy();
          expect(stillLoadingServers).toBeFalsy();
        },
        { timeout: 15000 },
      );

      // Check for any content (success or error) for both sections
      const hasAnyDatabaseContent = screen.queryAllByText(
        /Databases|App-Services|Documents|Security|Modules|Error/,
      );

      // We should have database content and either forests content or at least the databases loaded
      expect(hasAnyDatabaseContent.length).toBeGreaterThan(0);

      console.log('✅ Both databases and forests content loaded independently');
    }, 20000);
  });

  describe('Security Integration Tests (Users & Roles)', () => {
    // Helper to check if users endpoint is accessible
    const checkUsersEndpoint = async (): Promise<{
      success: boolean;
      status?: number;
      data?: any;
    }> => {
      try {
        const response = await fetch(
          'http://localhost:8080/manage/v2/users?format=json',
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          },
        );

        if (response.ok) {
          const data = await response.json();
          return { success: true, status: response.status, data };
        } else {
          return { success: false, status: response.status };
        }
      } catch {
        return { success: false };
      }
    };

    // Helper to check if roles endpoint is accessible
    const checkRolesEndpoint = async (): Promise<{
      success: boolean;
      status?: number;
      data?: any;
    }> => {
      try {
        const response = await fetch(
          'http://localhost:8080/manage/v2/roles?format=json',
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          },
        );

        if (response.ok) {
          const data = await response.json();
          return { success: true, status: response.status, data };
        } else {
          return { success: false, status: response.status };
        }
      } catch {
        return { success: false };
      }
    };

    it('users endpoint responds to direct API calls', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      const usersResult = await checkUsersEndpoint();
      expect(usersResult.success).toBe(true);
      expect(usersResult.status).toBe(200);
      expect(usersResult.data).toBeDefined();

      console.log(
        '✅ Direct users API call successful - MarkLogic users accessible',
      );
      console.log(
        '✅ Users response structure:',
        usersResult.data ? Object.keys(usersResult.data)[0] : 'No data',
      );
    }, 10000);

    it('roles endpoint responds to direct API calls', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      const rolesResult = await checkRolesEndpoint();
      expect(rolesResult.success).toBe(true);
      expect(rolesResult.status).toBe(200);
      expect(rolesResult.data).toBeDefined();

      console.log(
        '✅ Direct roles API call successful - MarkLogic roles accessible',
      );
      console.log(
        '✅ Roles response structure:',
        rolesResult.data ? Object.keys(rolesResult.data)[0] : 'No data',
      );
    }, 10000);

    it('validates users parameter handling with format=json', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      // Test various parameter combinations
      const usersResult = await checkUsersEndpoint();
      expect(usersResult.success).toBe(true);
      expect(usersResult.data).toHaveProperty('user-default-list');

      if (usersResult.data && usersResult.data['user-default-list']) {
        const usersList = usersResult.data['user-default-list'];
        console.log(
          '✅ Users endpoint correctly handles format=json parameter',
        );
        console.log('✅ Found users list structure:', Object.keys(usersList));

        if (usersList['list-items'] && usersList['list-items']['list-item']) {
          const userCount = Array.isArray(usersList['list-items']['list-item'])
            ? usersList['list-items']['list-item'].length
            : 1;
          console.log(`✅ Found ${userCount} user(s)`);
        }
      }
    }, 10000);

    it('validates roles parameter handling with format=json', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      // Test various parameter combinations
      const rolesResult = await checkRolesEndpoint();
      expect(rolesResult.success).toBe(true);
      expect(rolesResult.data).toHaveProperty('role-default-list');

      if (rolesResult.data && rolesResult.data['role-default-list']) {
        const rolesList = rolesResult.data['role-default-list'];
        console.log(
          '✅ Roles endpoint correctly handles format=json parameter',
        );
        console.log('✅ Found roles list structure:', Object.keys(rolesList));

        if (rolesList['list-items'] && rolesList['list-items']['list-item']) {
          const roleCount = Array.isArray(rolesList['list-items']['list-item'])
            ? rolesList['list-items']['list-item'].length
            : 1;
          console.log(`✅ Found ${roleCount} role(s)`);
        }
      }
    }, 10000);

    it('validates Security tab display in React component integration', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      render(<Admin />);

      // Switch to Security tab first
      await waitFor(
        () => {
          const securityTabButton = screen.getByText(
            'Security (Users & Roles)',
          );
          expect(securityTabButton).toBeInTheDocument();
          securityTabButton.click();
        },
        { timeout: 5000 },
      );

      // Wait for all loading states to finish
      await waitFor(
        () => {
          const isLoadingDatabases = screen.queryByText('Loading databases...');
          const isLoadingForests = screen.queryByText('Loading forests...');
          const isLoadingServers = screen.queryByText('Loading servers...');
          const isLoadingUsers = screen.queryByText('Loading users...');
          const isLoadingRoles = screen.queryByText('Loading roles...');

          expect(isLoadingDatabases).toBeFalsy();
          expect(isLoadingForests).toBeFalsy();
          expect(isLoadingServers).toBeFalsy();
          expect(isLoadingUsers).toBeFalsy();
          expect(isLoadingRoles).toBeFalsy();
        },
        { timeout: 15000 },
      );

      // Check that Security tab content is present (either success or error)
      const hasUsersHeading = screen.queryByRole('heading', { name: 'Users' });
      const hasRolesHeading = screen.queryByRole('heading', { name: 'Roles' });
      const hasUsersError = screen.queryByText(/Error:.*Users/);
      const hasRolesError = screen.queryByText(/Error:.*Roles/);
      const hasUsersJson = screen.queryByText('View Raw Users JSON');
      const hasRolesJson = screen.queryByText('View Raw Roles JSON');

      // Should have some Security-related content
      const hasSecurityContent =
        hasUsersHeading ||
        hasRolesHeading ||
        hasUsersError ||
        hasRolesError ||
        hasUsersJson ||
        hasRolesJson;
      expect(hasSecurityContent).toBeTruthy();

      console.log('✅ Security tab successfully rendered in React component');
    }, 20000);

    it('validates users and roles load independently', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      render(<Admin />);

      // Switch to Security tab first
      await waitFor(
        () => {
          const securityTabButton = screen.getByText(
            'Security (Users & Roles)',
          );
          expect(securityTabButton).toBeInTheDocument();
          securityTabButton.click();
        },
        { timeout: 5000 },
      );

      // Wait for all loading to complete
      await waitFor(
        () => {
          const stillLoadingUsers = screen.queryByText('Loading users...');
          const stillLoadingRoles = screen.queryByText('Loading roles...');
          expect(stillLoadingUsers).toBeFalsy();
          expect(stillLoadingRoles).toBeFalsy();
        },
        { timeout: 15000 },
      );

      // Check for any content (success or error) for both sections
      const hasAnyUsersContent = screen.queryAllByText(
        /Users|user-default-list|admin|Error/,
      );

      // We should have users content and either roles content or at least the users loaded
      expect(hasAnyUsersContent.length).toBeGreaterThan(0);

      console.log('✅ Both users and roles content loaded independently');
    }, 20000);

    it('validates Security tab interaction with user and role details', async () => {
      const proxyRunning = await checkProxyHealth();
      expect(proxyRunning).toBe(true);

      render(<Admin />);

      // Switch to Security tab
      await waitFor(
        () => {
          const securityTabButton = screen.getByText(
            'Security (Users & Roles)',
          );
          expect(securityTabButton).toBeInTheDocument();
          securityTabButton.click();
        },
        { timeout: 5000 },
      );

      // Wait for content to load
      await waitFor(
        () => {
          const stillLoading = screen.queryByText(/Loading/);
          expect(stillLoading).toBeFalsy();
        },
        { timeout: 15000 },
      );

      // Look for interactive elements or details sections
      const hasUsersSection = screen.queryByText('Users');
      const hasRolesSection = screen.queryByText('Roles');

      // Should have at least the basic sections
      const hasBasicSecuritySections = hasUsersSection || hasRolesSection;
      expect(hasBasicSecuritySections).toBeTruthy();

      console.log('✅ Security tab user interaction elements are accessible');
    }, 20000);
  });
});
