import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Admin from '../Admin';
import '@testing-library/jest-dom';

// Mock the fetch function
(globalThis as any).fetch = vi.fn();

describe('DetailsModal Integration Tests', () => {
    const mockDatabasesResponse = {
        'database-default-list': {
            'list-items': {
                'list-item': [
                    {
                        nameref: 'Documents',
                        uriref: '/manage/v2/databases/Documents',
                        idref: 'db123'
                    },
                    {
                        nameref: 'Security',
                        uriref: '/manage/v2/databases/Security',
                        idref: 'db456'
                    }
                ]
            }
        }
    };

    const mockForestsResponse = {
        'forest-default-list': {
            'list-items': {
                'list-item': [
                    {
                        nameref: 'Documents',
                        uriref: '/manage/v2/forests/Documents',
                        idref: 'forest123'
                    }
                ]
            }
        }
    };

    const mockServersResponse = {
        'server-default-list': {
            'list-items': {
                'list-item': [
                    {
                        nameref: 'Admin',
                        uriref: '/manage/v2/servers/Admin',
                        idref: 'server123',
                        kindref: 'http',
                        groupnameref: 'Default'
                    }
                ]
            }
        }
    };

    const mockUsersResponse = {
        'user-default-list': {
            'list-items': {
                'list-item': [
                    {
                        nameref: 'admin',
                        uriref: '/manage/v2/users/admin',
                        idref: 'user123'
                    }
                ]
            }
        }
    };

    const mockRolesResponse = {
        'role-default-list': {
            'list-items': {
                'list-item': [
                    {
                        nameref: 'admin',
                        uriref: '/manage/v2/roles/admin',
                        idref: 'role123'
                    }
                ]
            }
        }
    };

    const mockGroupsResponse = {
        'group-default-list': {
            'list-items': {
                'list-item': [
                    {
                        nameref: 'Default',
                        uriref: '/manage/v2/groups/Default',
                        idref: 'group123'
                    }
                ]
            }
        }
    };

    const mockDatabaseDetails = {
        'database-name': 'Documents',
        'enabled': true,
        'uri-lexicon': false,
        'security-database': 'Security',
        'schema-database': 'Schemas',
        'triggers-database': 'Triggers',
        'forest': ['Documents']
    };

    const mockForestDetails = {
        'forest-properties': {
            'forest-name': 'Documents',
            'host': 'localhost',
            'enabled': true,
            'data-directory': '/var/opt/MarkLogic/Forests/Documents'
        }
    };

    const mockServerDetails = {
        'server-name': 'Admin',
        'server-type': 'http',
        'enabled': true,
        'port': 8001,
        'root': '/',
        'group-name': 'Default'
    };

    const mockUserDetails = {
        'user-name': 'admin',
        'description': 'Administrator user',
        'password': '',
        'roles': ['admin']
    };

    const mockRoleDetails = {
        'role-name': 'admin',
        'description': 'Administrator role',
        'compartment': 'default',
        'privileges': [
            { 'privilege-name': 'admin' },
            { 'privilege-name': 'manage-user' }
        ]
    };

    const mockGroupDetails = {
        'group-name': 'Default',
        'modules-root': '/',
        'root': '/',
        'http-user-agent': 'MarkLogic'
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup fetch mocks for different endpoints
        (fetch as any).mockImplementation((url: string) => {
            if (url.includes('/databases')) {
                if (url.includes('/databases/Documents')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockDatabaseDetails)
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockDatabasesResponse)
                });
            }

            if (url.includes('/forests')) {
                if (url.includes('/forests/Documents')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockForestDetails)
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockForestsResponse)
                });
            }

            if (url.includes('/servers')) {
                if (url.includes('/servers/Admin')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockServerDetails)
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockServersResponse)
                });
            }

            if (url.includes('/users')) {
                if (url.includes('/users/admin')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockUserDetails)
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockUsersResponse)
                });
            }

            if (url.includes('/roles')) {
                if (url.includes('/roles/admin')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockRoleDetails)
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockRolesResponse)
                });
            }

            if (url.includes('/groups')) {
                if (url.includes('/groups/Default')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockGroupDetails)
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockGroupsResponse)
                });
            }

            return Promise.reject(new Error('Unknown endpoint'));
        });
    });

    describe('Cross-component DetailsModal functionality', () => {
        it('opens DetailsModal for databases from Data tab', async () => {
            render(<Admin />);

            // Switch to Data tab first
            const dataTabButton = screen.getByText('Data (Databases & Forests)');
            fireEvent.click(dataTabButton);

            // Wait for databases to load - find Documents database specifically
            await waitFor(() => {
                const databasesSection = screen.getByText('Databases').closest('section');
                expect(within(databasesSection!).getByText('Documents')).toBeInTheDocument();
            });

            // Hover over the database to show tooltip
            const databasesSection = screen.getByText('Databases').closest('section');
            const databaseElement = within(databasesSection!).getByText('Documents');
            fireEvent.mouseEnter(databaseElement);

            // Wait for tooltip and show details button
            await waitFor(() => {
                expect(screen.getByText('Show Details')).toBeInTheDocument();
            });

            // Click show details button
            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Check that modal opens with correct content
            await waitFor(() => {
                expect(screen.getByText('Database Details:')).toBeInTheDocument();
                expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
            });
        });

        it('opens DetailsModal for servers from Infrastructure tab', async () => {
            render(<Admin />);

            // Switch to Infrastructure tab
            const infrastructureTab = screen.getByText('Infrastructure (Servers & Groups)');
            fireEvent.click(infrastructureTab);

            // Wait for servers to load
            await waitFor(() => {
                expect(screen.getByText('Admin')).toBeInTheDocument();
            });

            // Hover over the server to show tooltip
            const serverElement = screen.getByText('Admin');
            fireEvent.mouseEnter(serverElement);

            // Wait for tooltip and show details button
            await waitFor(() => {
                expect(screen.getByText('Show Details')).toBeInTheDocument();
            });

            // Click show details button
            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Check that modal opens with correct content
            await waitFor(() => {
                expect(screen.getByText('Server Details:')).toBeInTheDocument();
                expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
            });
        });

        it('opens DetailsModal for users from Security tab', async () => {
            render(<Admin />);

            // Switch to Security tab
            const securityTab = screen.getByText('Security (Users & Roles)');
            fireEvent.click(securityTab);

            // Wait for users to load - find admin user specifically
            await waitFor(() => {
                const usersSection = screen.getByText('Users').closest('section');
                expect(within(usersSection!).getByText('admin')).toBeInTheDocument();
            });

            // Find the user item in users section (not the role with same name)
            const usersSection = screen.getByText('Users').closest('section');
            const userElement = within(usersSection!).getByText('admin');

            // Hover over the user to show tooltip
            fireEvent.mouseEnter(userElement);

            // Wait for tooltip and show details button
            await waitFor(() => {
                expect(screen.getByText('Show Details')).toBeInTheDocument();
            });

            // Click show details button
            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Check that modal opens with correct content
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(within(modal).getByText('User Details:')).toBeInTheDocument();
                expect(within(modal).getByText('Complete JSON Data')).toBeInTheDocument();
            });
        });

        it('handles multiple modals correctly - only one open at a time', async () => {
            render(<Admin />);

            // Switch to Data tab first
            const dataTabButton = screen.getByText('Data (Databases & Forests)');
            fireEvent.click(dataTabButton);

            // Wait for databases to load - find Documents database specifically
            await waitFor(() => {
                const databasesSection = screen.getByText('Databases').closest('section');
                expect(within(databasesSection!).getByText('Documents')).toBeInTheDocument();
            });

            // Open first modal (database) - find Documents in databases section
            const databasesSection = screen.getByText('Databases').closest('section');
            const databaseElement = within(databasesSection!).getByText('Documents');
            fireEvent.mouseEnter(databaseElement);

            await waitFor(() => {
                expect(screen.getByText('Show Details')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Show Details'));

            await waitFor(() => {
                expect(screen.getByText('Database Details:')).toBeInTheDocument();
            });

            // Close the modal
            fireEvent.click(screen.getByTitle('Close'));

            await waitFor(() => {
                expect(screen.queryByText('Database Details:')).not.toBeInTheDocument();
            });

            // Switch to Infrastructure tab and open server modal
            const infrastructureTab = screen.getByText('Infrastructure (Servers & Groups)');
            fireEvent.click(infrastructureTab);

            await waitFor(() => {
                expect(screen.getByText('Admin')).toBeInTheDocument();
            });

            const serverElement = screen.getByText('Admin');
            fireEvent.mouseEnter(serverElement);

            await waitFor(() => {
                expect(screen.getByText('Show Details')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Show Details'));

            await waitFor(() => {
                expect(screen.getByText('Server Details:')).toBeInTheDocument();
            });

            // Ensure no database modal is open
            expect(screen.queryByText('Database Details:')).not.toBeInTheDocument();
        });

        it('preserves modal content when switching between items of same type', async () => {
            render(<Admin />);

            // Switch to Data tab first
            const dataTabButton = screen.getByText('Data (Databases & Forests)');
            fireEvent.click(dataTabButton);

            // Wait for databases to load - find Documents database specifically
            await waitFor(() => {
                const databasesSection = screen.getByText('Databases').closest('section');
                expect(within(databasesSection!).getByText('Documents')).toBeInTheDocument();
            });

            // Open Documents database modal
            const databasesSection = screen.getByText('Databases').closest('section');
            const documentsElement = within(databasesSection!).getByText('Documents');
            fireEvent.mouseEnter(documentsElement);

            await waitFor(() => {
                expect(screen.getByText('Show Details')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Show Details'));

            await waitFor(() => {
                expect(screen.getByText('Database Details:')).toBeInTheDocument();
            });

            // Close modal
            fireEvent.click(screen.getByTitle('Close'));

            // Open Security database modal (if available)
            const securityElement = within(databasesSection!).queryByText('Security');
            if (securityElement) {
                fireEvent.mouseEnter(securityElement);

                await waitFor(() => {
                    const showDetailsButtons = screen.getAllByText('Show Details');
                    expect(showDetailsButtons.length).toBeGreaterThan(0);
                });

                fireEvent.click(screen.getByText('Show Details'));

                await waitFor(() => {
                    expect(screen.getByText('Database Details:')).toBeInTheDocument();
                });
            }
        });
    });

    describe('Tab switching with DetailsModal', () => {
        it('closes modal when switching tabs', async () => {
            render(<Admin />);

            // Switch to Data tab
            const dataTabButton = screen.getByText('Data (Databases & Forests)');
            fireEvent.click(dataTabButton);

            // Wait for databases to load - find Documents database specifically
            await waitFor(() => {
                const databasesSection = screen.getByText('Databases').closest('section');
                expect(within(databasesSection!).getByText('Documents')).toBeInTheDocument();
            });

            // Open database modal
            const databasesSection = screen.getByText('Databases').closest('section');
            const databaseElement = within(databasesSection!).getByText('Documents');
            fireEvent.mouseEnter(databaseElement);

            await waitFor(() => {
                expect(screen.getByText('Show Details')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Show Details'));

            await waitFor(() => {
                expect(screen.getByText('Database Details:')).toBeInTheDocument();
            });

            // Switch to Infrastructure tab
            const infrastructureTab = screen.getByText('Infrastructure (Servers & Groups)');
            fireEvent.click(infrastructureTab);

            // Modal should close when switching tabs
            await waitFor(() => {
                expect(screen.queryByText('Database Details:')).not.toBeInTheDocument();
            });
        });
    });

    describe('Error handling in DetailsModal integration', () => {
        it('handles modal errors gracefully', async () => {
            // Setup fetch to fail for details requests
            (fetch as any).mockImplementation((url: string) => {
                if (url.includes('/databases') && !url.includes('/databases/Documents')) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockDatabasesResponse)
                    });
                }
                return Promise.reject(new Error('Network error'));
            });

            render(<Admin />);

            // Switch to Data tab
            const dataTabButton = screen.getByText('Data (Databases & Forests)');
            fireEvent.click(dataTabButton);

            // Wait for databases to load
            await waitFor(() => {
                expect(screen.getByText('Documents')).toBeInTheDocument();
            });

            // Try to open modal - it should still render even without details
            const databaseElement = screen.getByText('Documents');
            fireEvent.mouseEnter(databaseElement);

            // Even without details, the basic info should show
            await waitFor(() => {
                expect(screen.getByText(/Show Details/)).toBeInTheDocument();
            });
        });
    });
});
