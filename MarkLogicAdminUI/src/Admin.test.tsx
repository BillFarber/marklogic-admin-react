import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Admin from './Admin';
import '@testing-library/jest-dom';

// Mock fetch globally
globalThis.fetch = vi.fn();

// Timer management
beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.clearAllTimers();
    // Only restore timers if fake timers are active
    try {
        vi.useRealTimers();
    } catch {
        // Ignore if real timers are already active
    }
});

// Helper function to create mock responses for all six endpoints (databases, forests, servers, groups, users, roles)
const mockAllEndpoints = (databasesResponse: any, forestsResponse: any, serversResponse: any, groupsResponse: any = null, usersResponse: any = null, rolesResponse: any = null) => {
    const defaultGroupsResponse = groupsResponse || {
        'group-default-list': {
            'list-items': {
                'list-item': []
            }
        }
    };

    const defaultUsersResponse = usersResponse || {
        'user-default-list': {
            'list-items': {
                'list-item': []
            }
        }
    };

    const defaultRolesResponse = rolesResponse || {
        'role-default-list': {
            'list-items': {
                'list-item': []
            }
        }
    };

    (fetch as any)
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(databasesResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(forestsResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(serversResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(defaultGroupsResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(defaultUsersResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(defaultRolesResponse)
        });
};

// Helper function to create mock responses including database, forest, server, group, user, role, and host details
const mockAllEndpointsWithDetails = (
    databasesResponse: any,
    forestsResponse: any,
    serversResponse: any,
    groupsResponse: any = null,
    usersResponse: any = null,
    rolesResponse: any = null,
    databaseDetailsResponses: Record<string, any> = {},
    forestDetailsResponses: Record<string, any> = {},
    serverDetailsResponses: Record<string, any> = {},
    groupDetailsResponses: Record<string, any> = {},
    userDetailsResponses: Record<string, any> = {},
    roleDetailsResponses: Record<string, any> = {},
    hostsResponse: any = null,
    hostDetailsResponses: Record<string, any> = {}
) => {
    const defaultGroupsResponse = groupsResponse || {
        'group-default-list': {
            'list-items': {
                'list-item': []
            }
        }
    };

    const defaultUsersResponse = usersResponse || {
        'user-default-list': {
            'list-items': {
                'list-item': []
            }
        }
    };

    const defaultRolesResponse = rolesResponse || {
        'role-default-list': {
            'list-items': {
                'list-item': []
            }
        }
    };

    const defaultHostsResponse = hostsResponse || {
        'host-default-list': {
            'list-items': {
                'list-item': []
            }
        }
    };

    const fetchMock = fetch as any;

    // Mock the initial 7 endpoints
    fetchMock
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(databasesResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(forestsResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(serversResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(defaultGroupsResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(defaultUsersResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(defaultRolesResponse)
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(defaultHostsResponse)
        });

    // Mock database detail endpoints for each database with idref
    if (databasesResponse && databasesResponse['database-default-list']?.['list-items']?.['list-item']) {
        const dbList = databasesResponse['database-default-list']['list-items']['list-item'];
        dbList.filter((db: any) => db.idref).forEach((db: any) => {
            const detailResponse = databaseDetailsResponses[db.idref] || {
                'database-name': db.nameref,
                'enabled': true,
                'forest': []
            };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(detailResponse)
            });
        });
    }

    // Mock forest detail endpoints for each forest with idref
    if (forestsResponse && forestsResponse['forest-default-list']?.['list-items']?.['list-item']) {
        const forestList = forestsResponse['forest-default-list']['list-items']['list-item'];
        forestList.filter((forest: any) => forest.idref).forEach((forest: any) => {
            const detailResponse = forestDetailsResponses[forest.idref] || {
                'forest-name': forest.nameref,
                'enabled': true,
                'host': 'localhost',
                'data-directory': '/var/opt/MarkLogic/Forests/' + forest.nameref,
                'updates-allowed': 'all',
                'availability': 'online'
            };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(detailResponse)
            });
        });
    }

    // Mock server detail endpoints for each server with nameref
    if (serversResponse && serversResponse['server-default-list']?.['list-items']?.['list-item']) {
        const serverList = serversResponse['server-default-list']['list-items']['list-item'];
        serverList.filter((server: any) => server.nameref).forEach((server: any) => {
            const detailResponse = serverDetailsResponses[server.nameref] || {
                'server-name': server.nameref,
                'enabled': true,
                'port': 8000,
                'server-type': 'http'
            };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(detailResponse)
            });
        });
    }

    // Mock group detail endpoints for each group with nameref
    if (defaultGroupsResponse && defaultGroupsResponse['group-default-list']?.['list-items']?.['list-item']) {
        const groupList = defaultGroupsResponse['group-default-list']['list-items']['list-item'];
        groupList.filter((group: any) => group.nameref).forEach((group: any) => {
            const detailResponse = groupDetailsResponses[group.nameref] || {
                'group-name': group.nameref,
                'description': 'Sample group',
                'security-database': 'Security',
                'schema-database': 'Schemas'
            };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(detailResponse)
            });
        });
    }

    // Mock user detail endpoints for each user with nameref
    if (defaultUsersResponse && defaultUsersResponse['user-default-list']?.['list-items']?.['list-item']) {
        const userList = defaultUsersResponse['user-default-list']['list-items']['list-item'];
        userList.filter((user: any) => user.nameref).forEach((user: any) => {
            const detailResponse = userDetailsResponses[user.nameref] || {
                'user-name': user.nameref,
                'role': ['role1'],
                'permissions': {},
                'collections': {}
            };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(detailResponse)
            });
        });
    }

    // Mock role detail endpoints for each role with nameref
    if (defaultRolesResponse && defaultRolesResponse['role-default-list']?.['list-items']?.['list-item']) {
        const roleList = defaultRolesResponse['role-default-list']['list-items']['list-item'];
        roleList.filter((role: any) => role.nameref).forEach((role: any) => {
            const detailResponse = roleDetailsResponses[role.nameref] || {
                'role-name': role.nameref,
                'description': 'Sample role',
                'privilege': [],
                'permission': [],
                'collection': []
            };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(detailResponse)
            });
        });
    }

    // Mock host detail endpoints for each host with nameref
    if (defaultHostsResponse && defaultHostsResponse['host-default-list']?.['list-items']?.['list-item']) {
        const hostList = defaultHostsResponse['host-default-list']['list-items']['list-item'];
        hostList.filter((host: any) => host.nameref).forEach((host: any) => {
            const detailResponse = hostDetailsResponses[host.nameref] || {
                'host-name': host.nameref,
                'group': 'Default',
                'bind-port': 7999,
                'foreign-bind-port': 7998,
                'zone': 'local-cluster'
            };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(detailResponse)
            });
        });
    }
};

// Helper function to create mock error responses for all seven endpoints
const mockAllEndpointsWithError = (status: number, statusText: string) => {
    (fetch as any)
        .mockResolvedValueOnce({
            ok: false,
            status,
            statusText
        })
        .mockResolvedValueOnce({
            ok: false,
            status,
            statusText
        })
        .mockResolvedValueOnce({
            ok: false,
            status,
            statusText
        })
        .mockResolvedValueOnce({
            ok: false,
            status,
            statusText
        })
        .mockResolvedValueOnce({
            ok: false,
            status,
            statusText
        })
        .mockResolvedValueOnce({
            ok: false,
            status,
            statusText
        })
        .mockResolvedValueOnce({
            ok: false,
            status,
            statusText
        });
};

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
        expect(screen.getByText('Loading database details...')).toBeInTheDocument();
        expect(screen.getByText('Loading forests...')).toBeInTheDocument();
        expect(screen.getByText('Loading servers...')).toBeInTheDocument();
        expect(screen.getByText('Loading users...')).toBeInTheDocument();
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

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/manage/v2/servers?format=json',
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            }
        );

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/manage/v2/users?format=json',
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

        // Mock all six API calls - databases, forests, servers, groups, users, and roles
        mockAllEndpoints(
            mockDatabasesResponse,
            { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
            { 'server-default-list': { 'list-items': { 'list-item': [] } } },
            { 'group-default-list': { 'list-items': { 'list-item': [] } } }
        );

        render(<Admin />);

        // Click on Data tab to see databases
        const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
        fireEvent.click(dataTabButton);

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
        mockAllEndpointsWithError(500, 'Internal Server Error');

        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByText(/Error:.*HTTP 500: Internal Server Error/)).toBeInTheDocument();
        });

        // Should not show loading or databases content
        expect(screen.queryByText('Loading databases...')).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Databases' })).not.toBeInTheDocument();
    });

    it('displays error message when API call fails with network error', async () => {
        (fetch as any)
            .mockRejectedValueOnce(new Error('Network error'))
            .mockRejectedValueOnce(new Error('Network error'))
            .mockRejectedValueOnce(new Error('Network error'))
            .mockRejectedValue(new Error('Network error'));

        render(<Admin />);

        await waitFor(() => {
            expect(screen.getByText(/Error:.*Network error/)).toBeInTheDocument();
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

        mockAllEndpoints(
            mockEmptyResponse,
            { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
            { 'server-default-list': { 'list-items': { 'list-item': [] } } },
            { 'group-default-list': { 'list-items': { 'list-item': [] } } }
        );

        render(<Admin />);

        // Click on Data tab to see databases
        const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
        fireEvent.click(dataTabButton);

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

        mockAllEndpoints(
            mockResponseWithMixedData,
            { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
            { 'server-default-list': { 'list-items': { 'list-item': [] } } }
        );

        render(<Admin />);

        // Click on Data tab to see databases
        const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
        fireEvent.click(dataTabButton);

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

        mockAllEndpoints(
            mockMalformedResponse,
            mockMalformedResponse,
            { 'server-default-list': { 'list-items': { 'list-item': [] } } }
        );

        render(<Admin />);

        // Click on Data tab to see databases/forests
        const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
        fireEvent.click(dataTabButton);

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

            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                mockForestsResponse,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Data tab to see forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

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
            // Mock databases success, forests failure, servers success, groups success, users success, roles success
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: false,
                    status: 404,
                    statusText: 'Not Found'
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'server-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'group-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'user-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'role-default-list': { 'list-items': { 'list-item': [] } } })
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
            // Mock databases success, forests network failure, servers success, groups success, users success, roles success
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockRejectedValueOnce(new Error('Connection timeout'))
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'server-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'group-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'user-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'role-default-list': { 'list-items': { 'list-item': [] } } })
                });

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

            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                mockEmptyForestsResponse,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'group-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Data tab to see forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Should show forests section but with empty list
            const forestsLists = screen.getAllByRole('list');
            const forestsList = forestsLists.find(list =>
                list.style.background === 'rgb(114, 47, 55)' // Burgundy background for forests
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

            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                mockResponseWithMixedData,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'group-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Data tab to see forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Should only show forest items with nameref
            expect(screen.getByText('Documents-forest')).toBeInTheDocument();
            expect(screen.getByText('Security-forest')).toBeInTheDocument();

            const forestsLists = screen.getAllByRole('list');
            const forestsList = forestsLists.find(list =>
                list.style.background === 'rgb(114, 47, 55)' // Burgundy background for forests
            );
            expect(forestsList?.children).toHaveLength(2);
        });

        it('handles malformed forests API response gracefully', async () => {
            const mockMalformedForestsResponse = {
                'some-other-forest-structure': 'value'
            };

            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                mockMalformedForestsResponse,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'group-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Data tab to see databases/forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                // Should show the JSON but not the forests list
                expect(screen.getByText(/"some-other-forest-structure"/)).toBeInTheDocument();
            });

            // Should not show forests section for malformed data
            expect(screen.queryByRole('heading', { name: 'Forests' })).not.toBeInTheDocument();
        });
    });

    // Servers-specific tests
    describe('Servers functionality', () => {
        it('makes a request to the servers endpoint with JSON format on mount', () => {
            // Mock fetch to return a pending promise
            (fetch as any).mockReturnValue(new Promise(() => { }));

            render(<Admin />);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/servers?format=json',
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                }
            );
        });

        it('displays servers list when API call succeeds', async () => {
            const mockServersResponse = {
                'server-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Admin', idref: '12345', kindref: 'http', groupnameref: 'Default' },
                            { nameref: 'App-Services', idref: '67890', kindref: 'http', groupnameref: 'Default' }
                        ]
                    }
                }
            };

            // Mock responses for all four endpoints using helper
            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                mockServersResponse,
                { 'group-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Infrastructure tab to see servers
            const infrastructureTabButton = screen.getByRole('button', { name: /Infrastructure \(Servers & Groups\)/ });
            fireEvent.click(infrastructureTabButton);

            // Wait for the servers API call to complete and component to update
            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Servers' })).toBeInTheDocument();
            });

            // Check that server names are displayed
            expect(screen.getByText('Admin')).toBeInTheDocument();
            expect(screen.getByText('App-Services')).toBeInTheDocument();

            // Check for server details - use getAllByText since multiple servers have the same type
            expect(screen.getAllByText(/Type: http/)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/Group: Default/)[0]).toBeInTheDocument();
        });

        it('shows servers with hover tooltips', async () => {
            const mockServersResponse = {
                'server-default-list': {
                    'list-items': {
                        'list-item': [
                            {
                                nameref: 'Admin',
                                idref: '12345',
                                kindref: 'http',
                                groupnameref: 'Default',
                                'content-db': 'Security',
                                'modules-db': 'Modules'
                            }
                        ]
                    }
                }
            };

            // Mock responses for all four endpoints using helper
            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                mockServersResponse
            );

            render(<Admin />);

            // Click on Infrastructure tab to see servers
            const infrastructureTabButton = screen.getByRole('button', { name: /Infrastructure \(Servers & Groups\)/ });
            fireEvent.click(infrastructureTabButton);

            // Wait for component to load
            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Servers' })).toBeInTheDocument();
            });

            const serverElement = screen.getByText('Admin');

            // Hover over the server
            fireEvent.mouseEnter(serverElement);

            // Check tooltip appears
            await waitFor(() => {
                expect(screen.getByText(/Server ID:/)).toBeInTheDocument();
                expect(screen.getByText(/Content Database:/)).toBeInTheDocument();
                // Be more specific about which "Security" text we're looking for - the one in the tooltip
                const tooltipContentDb = screen.getByText(/Content Database:/).parentElement;
                expect(tooltipContentDb?.textContent).toContain('Security');
                expect(screen.getByText(/Modules Database:/)).toBeInTheDocument();
                const tooltipModulesDb = screen.getByText(/Modules Database:/).parentElement;
                expect(tooltipModulesDb?.textContent).toContain('Modules');
            });

            // Hover away
            fireEvent.mouseLeave(serverElement);

            // Tooltip should disappear
            await waitFor(() => {
                expect(screen.queryByText(/Server ID:/)).not.toBeInTheDocument();
            });
        });

        it('filters out servers without nameref', async () => {
            const mockResponseWithMixedData = {
                'server-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Admin', idref: '12345', kindref: 'http' },
                            { idref: '67890', kindref: 'http' }, // No nameref, should be filtered out
                            { nameref: 'App-Services', idref: '11111', kindref: 'http' }
                        ]
                    }
                }
            };

            // Mock responses for all four endpoints using helper
            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                mockResponseWithMixedData
            );

            render(<Admin />);

            // Click on Infrastructure tab to see servers
            const infrastructureTabButton = screen.getByRole('button', { name: /Infrastructure \(Servers & Groups\)/ });
            fireEvent.click(infrastructureTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Servers' })).toBeInTheDocument();
            });

            // Should only show server items with nameref
            expect(screen.getByText('Admin')).toBeInTheDocument();
            expect(screen.getByText('App-Services')).toBeInTheDocument();

            const serversLists = screen.getAllByRole('list');
            const serversList = serversLists.find(list =>
                list.style.background === 'rgb(52, 73, 94)' // Blue-grey background for servers
            );
            expect(serversList?.children).toHaveLength(2);
        });

        it('handles malformed servers API response gracefully', async () => {
            const mockMalformedServersResponse = {
                'some-other-server-structure': 'value'
            };

            // Mock responses for all four endpoints using helper
            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                mockMalformedServersResponse
            );

            render(<Admin />);

            // Click on Infrastructure tab to see servers
            const infrastructureTabButton = screen.getByRole('button', { name: /Infrastructure \(Servers & Groups\)/ });
            fireEvent.click(infrastructureTabButton);

            await waitFor(() => {
                // Should show the JSON but not the servers list
                expect(screen.getByText(/"some-other-server-structure"/)).toBeInTheDocument();
            });

            // Should not show servers section for malformed data
            expect(screen.queryByRole('heading', { name: 'Servers' })).not.toBeInTheDocument();
        });

        it('displays servers raw JSON section', async () => {
            const mockServersResponse = {
                'server-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Admin', idref: '12345', kindref: 'http' }
                        ]
                    }
                }
            };

            // Mock responses for all four endpoints using helper
            mockAllEndpoints(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                mockServersResponse
            );

            render(<Admin />);

            // Click on Infrastructure tab to see servers
            const infrastructureTabButton = screen.getByRole('button', { name: /Infrastructure \(Servers & Groups\)/ });
            fireEvent.click(infrastructureTabButton);

            await waitFor(() => {
                expect(screen.getByText('View Raw Servers JSON')).toBeInTheDocument();
            });

            // Click to expand the details
            const serversDetailsToggle = screen.getByText('View Raw Servers JSON');
            fireEvent.click(serversDetailsToggle);

            // Should show the raw JSON
            await waitFor(() => {
                expect(screen.getByText(/"server-default-list"/)).toBeInTheDocument();
                expect(screen.getByText(/"nameref": "Admin"/)).toBeInTheDocument();
            });
        });

        it('shows loading servers message when servers data is not yet available', () => {
            // Mock responses where servers call is still pending
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'forest-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockReturnValueOnce(new Promise(() => { })) // Pending servers call
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'group-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'user-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'role-default-list': { 'list-items': { 'list-item': [] } } })
                });

            render(<Admin />);

            expect(screen.getByText('Loading servers...')).toBeInTheDocument();
        });

        it('includes servers error in combined error message on API failure', async () => {
            // Mock database and forest success, servers failure, groups success, users success, roles success
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'forest-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockRejectedValueOnce(new Error('Servers API error'))
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'group-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'user-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'role-default-list': { 'list-items': { 'list-item': [] } } })
                });

            render(<Admin />);

            await waitFor(() => {
                expect(screen.getByText(/Error:.*Servers: Servers API error/)).toBeInTheDocument();
            });
        });
    });

    // Integration tests for databases, forests, and servers
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

            // Mock successful responses for all four endpoints
            mockAllEndpoints(
                mockDatabasesResponse,
                mockForestsResponse,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Data tab to see databases and forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

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

            // Mock databases success, forests failure, servers success, groups success, users success, roles success
            (fetch as any)
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDatabasesResponse)
                })
                .mockRejectedValueOnce(new Error('Forests service unavailable'))
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'server-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'group-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'user-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'role-default-list': { 'list-items': { 'list-item': [] } } })
                });

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

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

            // Should make calls to all seven endpoints
            expect(fetch).toHaveBeenCalledTimes(7);
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/forests?format=json',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/servers?format=json',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/groups?format=json',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/users?format=json',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/roles?format=json',
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
        });

        it('accumulates error messages from both endpoints', async () => {
            // Mock all six endpoints to fail
            (fetch as any)
                .mockRejectedValueOnce(new Error('Database connection failed'))
                .mockRejectedValueOnce(new Error('Forest connection failed'))
                .mockRejectedValueOnce(new Error('Server connection failed'))
                .mockRejectedValueOnce(new Error('Groups connection failed'))
                .mockRejectedValueOnce(new Error('Users connection failed'))
                .mockRejectedValueOnce(new Error('Roles connection failed'));

            render(<Admin />);

            await waitFor(() => {
                const errorElement = screen.getByText(/Error:/);
                expect(errorElement.textContent).toContain('Database connection failed');
                expect(errorElement.textContent).toContain('Forest connection failed');
                expect(errorElement.textContent).toContain('Server connection failed');
                expect(errorElement.textContent).toContain('Groups connection failed');
                expect(errorElement.textContent).toContain('Users connection failed');
                expect(errorElement.textContent).toContain('Roles connection failed');
            });
        }); it('complete database details integration test', { timeout: 15000 }, async () => {
            // Start with real timers to let async operations complete normally

            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' },
                            { nameref: 'Security', idref: 'sec-456' }
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

            const mockDocumentsDetails = {
                'database-name': 'Documents',
                enabled: true,
                language: 'en',
                'security-database': 'Security',
                'schema-database': 'Schemas',
                'triggers-database': 'Triggers',
                forest: ['Documents-forest-1', 'Documents-forest-2'],
                'data-encryption': 'off',
                'stemmed-searches': true,
                'word-searches': false,
                'retired-forest-count': 1
            };

            const mockSecurityDetails = {
                'database-name': 'Security',
                enabled: false,
                language: 'en',
                'security-database': null,
                forest: ['Security-forest'],
                'retired-forest-count': 0
            };

            // Mock all API calls using the helper
            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                mockForestsResponse,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'group-default-list': { 'list-items': { 'list-item': [] } } },
                { 'user-default-list': { 'list-items': { 'list-item': [] } } },
                { 'role-default-list': { 'list-items': { 'list-item': [] } } },
                {
                    'doc-123': mockDocumentsDetails,
                    'sec-456': mockSecurityDetails
                }
            );

            render(<Admin />);

            // Click on Data tab to see databases/forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            // Wait for all data to load
            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Check database names and data-idref attributes
            const documentsItem = screen.getByText('Documents').closest('li');
            const securityItem = screen.getByText('Security').closest('li');
            expect(documentsItem).toHaveAttribute('data-idref', 'doc-123');
            expect(securityItem).toHaveAttribute('data-idref', 'sec-456');

            // Wait for database details to load
            await waitFor(() => {
                expect(screen.getAllByText(/Status: Enabled/).length).toBeGreaterThanOrEqual(1);
                expect(screen.getByText(/Status: Disabled/)).toBeInTheDocument();
            });

            // Check inline details for Documents
            expect(screen.getByText(/Forests: 2/)).toBeInTheDocument();
            expect(screen.getByText(/Security DB: Security/)).toBeInTheDocument();

            // Check inline details for Security
            expect(screen.getByText(/Forests: 1/)).toBeInTheDocument();
            expect(screen.getByText(/Security DB: N\/A/)).toBeInTheDocument();

            // Test hover tooltip for Documents
            const documentsName = screen.getAllByText('Documents')[0]; // Get the first occurrence (database name in list)
            fireEvent.mouseEnter(documentsName);

            await waitFor(() => {
                expect(screen.getByText('Database ID:')).toBeInTheDocument();
                expect(screen.getByText('doc-123')).toBeInTheDocument();
                expect(screen.getByText('Enabled:')).toBeInTheDocument();
                expect(screen.getByText('Yes')).toBeInTheDocument();
                expect(screen.getByText('Language:')).toBeInTheDocument();
                expect(screen.getByText('en')).toBeInTheDocument();
                expect(screen.getByText('Security Database:')).toBeInTheDocument();
                expect(screen.getAllByText('Security').length).toBeGreaterThanOrEqual(2); // Database name and security database value
                expect(screen.getByText('Schema Database:')).toBeInTheDocument();
                expect(screen.getByText('Schemas')).toBeInTheDocument();
                expect(screen.getByText('Triggers Database:')).toBeInTheDocument();
                expect(screen.getByText('Triggers')).toBeInTheDocument();
                expect(screen.getByText('Forests:')).toBeInTheDocument();
                expect(screen.getByText('Documents-forest-1, Documents-forest-2')).toBeInTheDocument();
                expect(screen.getByText('Data Encryption:')).toBeInTheDocument();
                expect(screen.getByText('off')).toBeInTheDocument();
                expect(screen.getByText('Stemmed Searches:')).toBeInTheDocument();
                // Check that both "Yes" (for Enabled status) and "Enabled" (for Stemmed Searches) are present
                expect(screen.getByText('Yes')).toBeInTheDocument(); // Enabled status
                expect(screen.getByText('Word Searches:')).toBeInTheDocument();
                // We should find one instance of the word "Enabled" after "Stemmed Searches:"
                const stemmedSearchesElement = screen.getByText('Stemmed Searches:').parentElement;
                expect(stemmedSearchesElement?.textContent).toContain('Enabled');
                expect(screen.getByText('Retired Forests:')).toBeInTheDocument();
                expect(screen.getByText('1')).toBeInTheDocument();
            }); fireEvent.mouseLeave(documentsName);

            // Use fake timers only for the hover timeout control
            vi.useFakeTimers();
            vi.advanceTimersByTime(350);
            vi.useRealTimers();

            // Wait for the Documents tooltip to disappear
            await waitFor(() => {
                expect(screen.queryByText('doc-123')).not.toBeInTheDocument();
            });

            // Test hover tooltip for Security
            const securityName = screen.getAllByText('Security')[0]; // Get the first occurrence (database name in list)
            fireEvent.mouseEnter(securityName);

            await waitFor(() => {
                expect(screen.getByText('Database ID:')).toBeInTheDocument();
                expect(screen.getByText('sec-456')).toBeInTheDocument();
                expect(screen.getByText('Enabled:')).toBeInTheDocument();
                expect(screen.getByText('No')).toBeInTheDocument();
                expect(screen.getByText('Forests:')).toBeInTheDocument();
                // Check that Security-forest appears in the tooltip (not just the forest list)
                const forestsInTooltip = screen.getByText('Forests:').parentElement;
                expect(forestsInTooltip?.textContent).toContain('Security-forest');
                // Should not show retired forests for 0
                expect(screen.queryByText('Retired Forests:')).not.toBeInTheDocument();
            });

            fireEvent.mouseLeave(securityName);

            // Check forests are displayed in the forests section
            const forestsSection = screen.getByRole('heading', { name: 'Forests' }).parentElement;
            expect(forestsSection?.textContent).toContain('Documents-forest');
            expect(forestsSection?.textContent).toContain('Security-forest');

            // Verify all API calls were made
            expect(fetch).toHaveBeenCalledTimes(9); // databases + forests + servers + groups + users + roles + hosts + 2 database details
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases',
                expect.any(Object)
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/forests?format=json',
                expect.any(Object)
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/servers?format=json',
                expect.any(Object)
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/doc-123/properties?format=json',
                expect.any(Object)
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/sec-456/properties?format=json',
                expect.any(Object)
            );
        });
    });

    // Database details functionality tests
    describe('Database details functionality', () => {
        it('adds data-idref attribute to database list items with idref', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' },
                            { nameref: 'Security', idref: 'sec-456' },
                            { nameref: 'NoIdref' } // No idref
                        ]
                    }
                }
            };

            mockAllEndpoints(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Check that items with idref have data-idref attribute
            const documentsItem = screen.getByText('Documents').closest('li');
            const securityItem = screen.getByText('Security').closest('li');
            const noIdrefItem = screen.getByText('NoIdref').closest('li');

            expect(documentsItem).toHaveAttribute('data-idref', 'doc-123');
            expect(securityItem).toHaveAttribute('data-idref', 'sec-456');
            expect(noIdrefItem).not.toHaveAttribute('data-idref');
        });

        it('fetches database details for items with idref', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' },
                            { nameref: 'Security', idref: 'sec-456' }
                        ]
                    }
                }
            };

            const mockDocumentsDetails = {
                'database-name': 'Documents',
                enabled: true,
                language: 'en',
                'security-database': 'Security',
                forest: ['Documents-forest-1', 'Documents-forest-2']
            };

            const mockSecurityDetails = {
                'database-name': 'Security',
                enabled: true,
                language: 'en',
                'security-database': null,
                forest: ['Security-forest']
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                {
                    'doc-123': mockDocumentsDetails,
                    'sec-456': mockSecurityDetails
                }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Verify database details API calls are made
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/doc-123/properties?format=json',
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                }
            );

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/sec-456/properties?format=json',
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                }
            );
        });

        it('displays database details inline with status, forests count, and security DB', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            const mockDatabaseDetails = {
                'database-name': 'Documents',
                enabled: true,
                'security-database': 'Security',
                forest: ['Documents-forest-1', 'Documents-forest-2']
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'group-default-list': { 'list-items': { 'list-item': [] } } },
                { 'user-default-list': { 'list-items': { 'list-item': [] } } },
                { 'role-default-list': { 'list-items': { 'list-item': [] } } },
                { 'doc-123': mockDatabaseDetails }
            );

            render(<Admin />);

            // Click on Data tab to see databases/forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByText(/Status: Enabled/)).toBeInTheDocument();
                expect(screen.getByText(/Forests: 2/)).toBeInTheDocument();
                expect(screen.getByText(/Security DB: Security/)).toBeInTheDocument();
            });
        });

        it('handles database details with disabled status and no security DB', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Test-DB', idref: 'test-123' }
                        ]
                    }
                }
            };

            const mockDatabaseDetails = {
                'database-name': 'Test-DB',
                enabled: false,
                'security-database': null,
                forest: []
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'group-default-list': { 'list-items': { 'list-item': [] } } },
                { 'user-default-list': { 'list-items': { 'list-item': [] } } },
                { 'role-default-list': { 'list-items': { 'list-item': [] } } },
                { 'test-123': mockDatabaseDetails }
            );

            render(<Admin />);

            // Click on Data tab to see databases/forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByText(/Status: Disabled/)).toBeInTheDocument();
                expect(screen.getByText(/Forests: 0/)).toBeInTheDocument();
                expect(screen.getByText(/Security DB: N\/A/)).toBeInTheDocument();
            });
        });

        it('shows loading state for database details while fetching', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            mockAllEndpoints(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } }
            );

            // Mock the database details call to return a pending promise
            (fetch as any).mockImplementationOnce(() => new Promise(() => { })); // Pending details promise

            render(<Admin />);

            // Click on Data tab to see databases/forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByText('Loading database details...')).toBeInTheDocument();
            });
        });

        it('handles database details fetch errors gracefully', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            mockAllEndpoints(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } }
            );

            // Mock the database details call to fail
            (fetch as any).mockImplementationOnce(() => Promise.reject(new Error('Database details fetch failed')));

            // Mock console.warn to check it's called
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Should not show details but should not crash
            expect(screen.queryByText(/Status:/)).not.toBeInTheDocument();
            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to fetch details for database Documents:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it('shows detailed hover tooltip when hovering over database name', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            const mockDatabaseDetails = {
                'database-name': 'Documents',
                enabled: true,
                language: 'en',
                'security-database': 'Security',
                'schema-database': 'Schemas',
                'triggers-database': 'Triggers',
                forest: ['Documents-forest-1', 'Documents-forest-2'],
                'data-encryption': 'off',
                'stemmed-searches': true,
                'word-searches': false,
                'retired-forest-count': 0
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                null, // groups
                null, // users  
                null, // roles
                { 'doc-123': mockDatabaseDetails }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Wait for details to load
            await waitFor(() => {
                expect(screen.getByText(/Status: Enabled/)).toBeInTheDocument();
            });

            const databaseName = screen.getByRole('listitem').querySelector('strong');
            expect(databaseName).not.toBeNull();

            // Hover over the database name
            fireEvent.mouseEnter(databaseName!);

            // Check that detailed tooltip appears
            await waitFor(() => {
                expect(screen.getByText('Database ID:')).toBeInTheDocument();
                expect(screen.getByText('doc-123')).toBeInTheDocument();
                expect(screen.getByText('Name:')).toBeInTheDocument();
                // Instead of searching for 'Documents' ambiguously, check the tooltip content structure
                const nameField = screen.getByText('Name:').parentElement;
                expect(nameField?.textContent).toContain('Documents');
                expect(screen.getByText('Enabled:')).toBeInTheDocument();
                expect(screen.getByText('Yes')).toBeInTheDocument();
                expect(screen.getByText('Language:')).toBeInTheDocument();
                // The language field shows the actual language value if available, otherwise N/A
                const languageField = screen.getByText('Language:').parentElement;
                expect(languageField?.textContent).toContain('en');
                expect(screen.getByText('Security Database:')).toBeInTheDocument();
                // Instead of searching for 'Security' ambiguously, check in the security database field
                const securityField = screen.getByText('Security Database:').parentElement;
                expect(securityField?.textContent).toContain('Security');
                expect(screen.getByText('Schema Database:')).toBeInTheDocument();
                const schemaField = screen.getByText('Schema Database:').parentElement;
                expect(schemaField?.textContent).toContain('Schemas');
                expect(screen.getByText('Triggers Database:')).toBeInTheDocument();
                const triggersField = screen.getByText('Triggers Database:').parentElement;
                expect(triggersField?.textContent).toContain('Triggers');
                expect(screen.getByText('Forests:')).toBeInTheDocument();
                const forestsField = screen.getByText('Forests:').parentElement;
                expect(forestsField?.textContent).toContain('Documents-forest-1, Documents-forest-2');
                expect(screen.getByText('Data Encryption:')).toBeInTheDocument();
                expect(screen.getByText('off')).toBeInTheDocument();
                expect(screen.getByText('Stemmed Searches:')).toBeInTheDocument();
                // Check that the stemmed searches field contains "Enabled"
                const stemmedSearchesField = screen.getByText('Stemmed Searches:').parentElement;
                expect(stemmedSearchesField?.textContent).toContain('Enabled');
                expect(screen.getByText('Word Searches:')).toBeInTheDocument();
                // Check that the word searches field contains "Disabled"
                const wordSearchesField = screen.getByText('Word Searches:').parentElement;
                expect(wordSearchesField?.textContent).toContain('Disabled');
            });

            // Mouse leave should hide tooltip
            fireEvent.mouseLeave(databaseName!);

            await waitFor(() => {
                expect(screen.queryByText('Database ID:')).not.toBeInTheDocument();
            });
        });

        it('shows retired forests count in tooltip when greater than 0', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            const mockDatabaseDetails = {
                'database-name': 'Documents',
                enabled: true,
                'retired-forest-count': 3,
                forest: []
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                null, // groups
                null, // users
                null, // roles
                { 'doc-123': mockDatabaseDetails } // database details
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Wait for details to load
            await waitFor(() => {
                expect(screen.getByText(/Status: Enabled/)).toBeInTheDocument();
            });

            const databaseName = screen.getByText('Documents');
            fireEvent.mouseEnter(databaseName);

            await waitFor(() => {
                expect(screen.getByText('Retired Forests:')).toBeInTheDocument();
                expect(screen.getByText('3')).toBeInTheDocument();
            });
        });

        it('does not show retired forests count in tooltip when 0', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            const mockDatabaseDetails = {
                'database-name': 'Documents',
                enabled: true,
                'retired-forest-count': 0,
                forest: []
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'doc-123': mockDatabaseDetails }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Wait for details to load
            await waitFor(() => {
                expect(screen.getByText(/Status: Enabled/)).toBeInTheDocument();
            });

            const databaseName = screen.getByText('Documents');
            fireEvent.mouseEnter(databaseName);

            await waitFor(() => {
                expect(screen.getByText('Database ID:')).toBeInTheDocument();
                expect(screen.getByText('doc-123')).toBeInTheDocument();
            });

            expect(screen.queryByText('Retired Forests:')).not.toBeInTheDocument();
        });

        it('handles null and undefined values in database details tooltip', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            const mockDatabaseDetails = {
                'database-name': 'Documents',
                enabled: true,
                language: null,
                'schema-database': null,
                forest: null
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'doc-123': mockDatabaseDetails }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Wait for details to load
            await waitFor(() => {
                expect(screen.getByText(/Status: Enabled/)).toBeInTheDocument();
            });

            const databaseName = screen.getByText('Documents');
            fireEvent.mouseEnter(databaseName);

            await waitFor(() => {
                expect(screen.getByText('Language:')).toBeInTheDocument();
                expect(screen.getAllByText('N/A').length).toBeGreaterThanOrEqual(4); // Multiple N/A values
                expect(screen.getByText('Security Database:')).toBeInTheDocument();
                expect(screen.getByText('Schema Database:')).toBeInTheDocument();
                expect(screen.getByText('Triggers Database:')).toBeInTheDocument();
                expect(screen.getByText('Forests:')).toBeInTheDocument();
                // Check that forests field is empty or shows appropriate null value
                const forestsField = screen.getByText('Forests:').parentElement;
                expect(forestsField?.textContent).toMatch(/Forests:\s*$/); // Forests: followed by whitespace/empty
            });
        });

        it('does not show tooltip for databases without details loaded', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' }
                        ]
                    }
                }
            };

            mockAllEndpoints(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } }
            );

            // Mock the database details call to return a pending promise
            (fetch as any).mockImplementationOnce(() => new Promise(() => { })); // Pending details promise

            render(<Admin />);

            // Click on Data tab to see databases/forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByText('Loading database details...')).toBeInTheDocument();
            });

            const databaseName = screen.getByText('Documents');
            fireEvent.mouseEnter(databaseName);

            // Should not show tooltip
            expect(screen.queryByText('Database ID:')).not.toBeInTheDocument();
        });

        it('fetches database details in parallel for multiple databases', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' },
                            { nameref: 'Security', idref: 'sec-456' },
                            { nameref: 'App-Services', idref: 'app-789' }
                        ]
                    }
                }
            };

            const mockDetails1 = { 'database-name': 'Documents', enabled: true };
            const mockDetails2 = { 'database-name': 'Security', enabled: true };
            const mockDetails3 = { 'database-name': 'App-Services', enabled: false };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                null, // groups
                null, // users  
                null, // roles
                {
                    'doc-123': mockDetails1,
                    'sec-456': mockDetails2,
                    'app-789': mockDetails3
                }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Verify all details API calls are made in parallel
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/doc-123/properties?format=json',
                expect.any(Object)
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/sec-456/properties?format=json',
                expect.any(Object)
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/app-789/properties?format=json',
                expect.any(Object)
            );

            // Wait for all details to load
            await waitFor(() => {
                expect(screen.getAllByText(/Status: Enabled/).length).toBeGreaterThanOrEqual(2);
                expect(screen.getByText(/Status: Disabled/)).toBeInTheDocument();
            });
        });

        it('skips database details fetch for databases without idref', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' },
                            { nameref: 'NoIdref' } // No idref
                        ]
                    }
                }
            };

            const mockDetails = { 'database-name': 'Documents', enabled: true };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                { 'doc-123': mockDetails }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Should only make one details call (for Documents)
            expect(fetch).toHaveBeenCalledTimes(8); // Initial databases + forests + servers + groups + users + roles + hosts + one database details call
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/databases/doc-123/properties?format=json',
                expect.any(Object)
            );

            // NoIdref should not have status display
            const noIdrefItem = screen.getByText('NoIdref').closest('li');
            expect(noIdrefItem?.textContent).not.toContain('Status:');
        });
    });

    // Raw Database Details section
    describe('Raw Database Details section', () => {
        it('displays raw database details JSON when details are loaded', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: 'doc-123' },
                            { nameref: 'Security', idref: 'sec-456' }
                        ]
                    }
                }
            };

            const mockDocumentsDetails = {
                'database-name': 'Documents',
                enabled: true,
                language: 'en',
                'security-database': 'Security',
                forest: ['Documents-forest-1', 'Documents-forest-2']
            };

            const mockSecurityDetails = {
                'database-name': 'Security',
                enabled: false,
                language: 'en',
                'security-database': null,
                forest: ['Security-forest']
            };

            mockAllEndpointsWithDetails(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                null, // groups
                null, // users  
                null, // roles
                {
                    'doc-123': mockDocumentsDetails,
                    'sec-456': mockSecurityDetails
                }
            );

            render(<Admin />);

            // Click on Data tab to see databases/forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            // Wait for database details to load
            await waitFor(() => {
                expect(screen.getAllByText(/Status: Enabled/).length).toBeGreaterThanOrEqual(1);
                expect(screen.getByText(/Status: Disabled/)).toBeInTheDocument();
            });

            // Check that the raw database details section exists
            expect(screen.getByText('View Raw Database Details JSON')).toBeInTheDocument();

            // Verify the JSON content contains the expected database details
            const detailsSection = screen.getByText('View Raw Database Details JSON').parentElement;
            expect(detailsSection?.textContent).toContain('doc-123');
            expect(detailsSection?.textContent).toContain('sec-456');
            expect(detailsSection?.textContent).toContain('Documents');
            expect(detailsSection?.textContent).toContain('Security');
        });

        it('does not display raw database details section when no details are loaded', async () => {
            const mockDatabasesResponse = {
                'database-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'NoIdrefDatabase' } // No idref, so no details will be fetched
                        ]
                    }
                }
            };

            mockAllEndpoints(
                mockDatabasesResponse,
                { 'forest-default-list': { 'list-items': { 'list-item': [] } } },
                { 'server-default-list': { 'list-items': { 'list-item': [] } } }
            );

            render(<Admin />);

            // Click on Data tab to see databases
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Databases' })).toBeInTheDocument();
            });

            // Should not show the raw database details section
            expect(screen.queryByText('View Raw Database Details JSON')).not.toBeInTheDocument();
        });
    });

    // Forest details tests  
    describe('Forest details functionality', () => {
        it('fetches details for forests with idref when forests load', async () => {
            const mockForestsResponse = {
                'forest-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: '123' },
                            { nameref: 'Security', idref: '456' }
                        ]
                    }
                }
            };

            const forestDetailsResponses = {
                '123': {
                    'forest-name': 'Documents',
                    'enabled': true,
                    'host': 'localhost',
                    'data-directory': '/var/opt/MarkLogic/Forests/Documents',
                    'updates-allowed': 'all',
                    'availability': 'online'
                },
                '456': {
                    'forest-name': 'Security',
                    'enabled': true,
                    'host': 'localhost',
                    'data-directory': '/var/opt/MarkLogic/Forests/Security',
                    'updates-allowed': 'read-only',
                    'availability': 'online'
                }
            };

            mockAllEndpointsWithDetails(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                mockForestsResponse,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                {},
                forestDetailsResponses
            );

            render(<Admin />);

            // Click on Data tab to see forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Check that fetch was called for forest details
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/forests/123/properties?format=json',
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                }
            );
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/manage/v2/forests/456/properties?format=json',
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                }
            );
        });

        it('displays enhanced forest details in hover tooltip', async () => {
            const mockForestsResponse = {
                'forest-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: '123' }
                        ]
                    }
                }
            };

            const forestDetailsResponses = {
                '123': {
                    'forest-name': 'Documents',
                    'enabled': true,
                    'host': 'test-host',
                    'data-directory': '/data/Documents',
                    'updates-allowed': 'all',
                    'availability': 'online',
                    'rebalancer-enable': true,
                    'database': 'Documents-DB'
                }
            };

            mockAllEndpointsWithDetails(
                { 'database-default-list': { 'list-items': { 'list-item': [] } } },
                mockForestsResponse,
                { 'server-default-list': { 'list-items': { 'list-item': [] } } },
                null, // groupsResponse
                null, // usersResponse
                null, // rolesResponse
                {}, // databaseDetailsResponses
                forestDetailsResponses // forestDetailsResponses
            );

            render(<Admin />);

            // Click on Data tab to see forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Hover over the forest name to trigger the tooltip
            const forestElement = screen.getByText('Documents');
            fireEvent.mouseEnter(forestElement);

            // Check that detailed forest information is displayed in tooltip
            await waitFor(() => {
                expect(screen.getByText('Host:')).toBeInTheDocument();
            });
            expect(screen.getByText('test-host')).toBeInTheDocument();
            expect(screen.getByText('Data Directory:')).toBeInTheDocument();
            expect(screen.getByText('/data/Documents')).toBeInTheDocument();
            expect(screen.getByText('Updates Allowed:')).toBeInTheDocument();
            expect(screen.getByText('all')).toBeInTheDocument();
            expect(screen.getByText('Availability:')).toBeInTheDocument();
            expect(screen.getByText('online')).toBeInTheDocument();
            expect(screen.getByText('Database:')).toBeInTheDocument();
            expect(screen.getByText('Documents-DB')).toBeInTheDocument();
        });

        it('handles forest details fetch failures gracefully', async () => {
            const mockForestsResponse = {
                'forest-default-list': {
                    'list-items': {
                        'list-item': [
                            { nameref: 'Documents', idref: '123' }
                        ]
                    }
                }
            };

            // Mock initial endpoints but forest details failure
            const fetchMock = fetch as any;
            fetchMock
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'database-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockForestsResponse)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'server-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'user-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 'role-default-list': { 'list-items': { 'list-item': [] } } })
                })
                .mockRejectedValueOnce(new Error('Forest details fetch failed'));

            // Mock console.warn to avoid noise in test output
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            render(<Admin />);

            // Click on Data tab to see forests
            const dataTabButton = screen.getByRole('button', { name: /Data \(Databases & Forests\)/ });
            fireEvent.click(dataTabButton);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Forests' })).toBeInTheDocument();
            });

            // Forest should still be displayed even if details fetch failed
            expect(screen.getByText('Documents')).toBeInTheDocument();

            // Console warning should be logged
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Failed to fetch details for forest Documents:',
                expect.any(Error)
            );

            consoleWarnSpy.mockRestore();
        });
    });
});
