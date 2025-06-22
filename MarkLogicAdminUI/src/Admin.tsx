import React from 'react';
import { SecurityTab, DataTab, InfrastructureTab, LogsTab } from './components';
import { useDatabases } from './hooks/useDatabases';
import { useHover } from './hooks/useHover';
import type {
    ForestListResponse,
    ForestDetailsMap,
    ServerListResponse,
    ServerDetailsMap,
    GroupListResponse,
    GroupDetailsMap,
    UserListResponse,
    UserDetailsMap,
    RoleListResponse,
    RoleDetailsMap,
    LogsResponse
} from './types/marklogic';

function Admin() {
    // Use custom hook for databases
    const { databases, databaseDetails, loading: databasesLoading, error: databasesError } = useDatabases();

    // Use custom hooks for hover states
    const databaseHover = useHover();
    const forestHover = useHover();
    const serverHover = useHover();
    const groupHover = useHover();
    const userHover = useHover();
    const roleHover = useHover();

    // Original state for other entities
    const [forests, setForests] = React.useState<ForestListResponse | null>(null);
    const [forestDetails, setForestDetails] = React.useState<ForestDetailsMap>({});
    const [servers, setServers] = React.useState<ServerListResponse | null>(null);
    const [serverDetails, setServerDetails] = React.useState<ServerDetailsMap>({});
    const [groups, setGroups] = React.useState<GroupListResponse | null>(null);
    const [groupDetails, setGroupDetails] = React.useState<GroupDetailsMap>({});
    const [users, setUsers] = React.useState<UserListResponse | null>(null);
    const [userDetails, setUserDetails] = React.useState<UserDetailsMap>({});
    const [roles, setRoles] = React.useState<RoleListResponse | null>(null);
    const [roleDetails, setRoleDetails] = React.useState<RoleDetailsMap>({});
    const [logs, setLogs] = React.useState<LogsResponse | null>(null);
    const [logsError, setLogsError] = React.useState<string | null>(null);
    const [logsLoading, setLogsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [activeTab, setActiveTab] = React.useState<string>('infrastructure');

    React.useEffect(() => {
        document.title = 'MarkLogic Admin';

        // Make requests to forests, servers, groups, users, and roles endpoints (databases handled by hook)
        const forestsUrl = 'http://localhost:8080/manage/v2/forests?format=json';
        const serversUrl = 'http://localhost:8080/manage/v2/servers?format=json';
        const groupsUrl = 'http://localhost:8080/manage/v2/groups?format=json';
        const usersUrl = 'http://localhost:8080/manage/v2/users?format=json';
        const rolesUrl = 'http://localhost:8080/manage/v2/roles?format=json';

        // Create promises for five endpoints (databases handled by hook)
        const forestsPromise = fetch(forestsUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(async (data) => {
                setForests(data);

                // Fetch details for each forest using idref
                if (data && Array.isArray(data['forest-default-list']?.['list-items']?.['list-item'])) {
                    const forestList = data['forest-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each forest in parallel
                    const detailPromises = forestList
                        .filter((forest: any) => forest.idref)
                        .map(async (forest: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/forests/${forest.idref}/properties?format=json`;
                                const response = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (response.ok) {
                                    const detailData = await response.json();
                                    details[forest.idref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for forest ${forest.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setForestDetails(details);
                }
            })
            .catch(e => setError(prev => prev ? `${prev}; Forests: ${e.message}` : `Forests: ${e.message}`));

        const serversPromise = fetch(serversUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(async (data) => {
                setServers(data);

                // Fetch details for each server using nameref and groupnameref
                if (data && Array.isArray(data['server-default-list']?.['list-items']?.['list-item'])) {
                    const serverList = data['server-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each server in parallel
                    const detailPromises = serverList
                        .filter((server: any) => server.nameref && server.groupnameref)
                        .map(async (server: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/servers/${server.nameref}/properties?group-id=${server.groupnameref}&format=json`;
                                const response = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (response.ok) {
                                    const detailData = await response.json();
                                    details[server.nameref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for server ${server.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setServerDetails(details);
                }
            })
            .catch(e => setError(prev => prev ? `${prev}; Servers: ${e.message}` : `Servers: ${e.message}`));

        const groupsPromise = fetch(groupsUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(async (data) => {
                setGroups(data);

                // Fetch details for each group using nameref
                if (data && Array.isArray(data['group-default-list']?.['list-items']?.['list-item'])) {
                    const groupList = data['group-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each group in parallel
                    const detailPromises = groupList
                        .filter((group: any) => group.nameref)
                        .map(async (group: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/groups/${group.nameref}/properties?format=json`;
                                const response = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (response.ok) {
                                    const detailData = await response.json();
                                    details[group.nameref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for group ${group.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setGroupDetails(details);
                }
            })
            .catch(e => setError(prev => prev ? `${prev}; Groups: ${e.message}` : `Groups: ${e.message}`));

        const usersPromise = fetch(usersUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(async (data) => {
                setUsers(data);

                // Fetch details for each user using nameref
                if (data && Array.isArray(data['user-default-list']?.['list-items']?.['list-item'])) {
                    const userList = data['user-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each user in parallel
                    const detailPromises = userList
                        .filter((user: any) => user.nameref)
                        .map(async (user: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/users/${user.nameref}/properties?format=json`;
                                const response = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (response.ok) {
                                    const detailData = await response.json();
                                    details[user.nameref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for user ${user.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setUserDetails(details);
                }
            })
            .catch(e => setError(prev => prev ? `${prev}; Users: ${e.message}` : `Users: ${e.message}`));

        const rolesPromise = fetch(rolesUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(async (data) => {
                setRoles(data);

                // Fetch details for each role using nameref
                if (data && Array.isArray(data['role-default-list']?.['list-items']?.['list-item'])) {
                    const roleList = data['role-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each role in parallel
                    const detailPromises = roleList
                        .filter((role: any) => role.nameref)
                        .map(async (role: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/roles/${role.nameref}/properties?format=json`;
                                const response = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (response.ok) {
                                    const detailData = await response.json();
                                    details[role.nameref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for role ${role.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setRoleDetails(details);
                }
            })
            .catch(e => setError(prev => prev ? `${prev}; Roles: ${e.message}` : `Roles: ${e.message}`));

        // Wait for all requests to complete, then stop loading (databases handled by hook)
        Promise.allSettled([forestsPromise, serversPromise, groupsPromise, usersPromise, rolesPromise])
            .then(() => setLoading(false));
    }, []);

    // Combine loading states
    const isLoading = loading || databasesLoading;

    // Combine error states
    const combinedError = [error, databasesError].filter(Boolean).join('; ') || null;

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>MarkLogic Admin (Proxy)</h1>
            <p>Welcome to the admin page using Spring Boot proxy.</p>

            {/* Loading and Error States */}
            {isLoading && (
                <div style={{ marginBottom: '1rem' }}>
                    <div>Loading database details...</div>
                    <div>Loading forests...</div>
                    <div>Loading servers...</div>
                    <div>Loading groups...</div>
                    <div>Loading users...</div>
                    <div>Loading roles...</div>
                </div>
            )}
            {combinedError && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {combinedError}</div>}

            {/* Tab Navigation */}
            <div style={{ margin: '2rem auto', maxWidth: 1000 }}>
                <div style={{
                    display: 'flex',
                    borderBottom: '2px solid #ddd',
                    marginBottom: '1rem',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => setActiveTab('infrastructure')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            backgroundColor: activeTab === 'infrastructure' ? '#2c3e50' : '#f5f5f5', // Blue-grey to complement burgundy
                            color: activeTab === 'infrastructure' ? '#fff' : '#333',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'infrastructure' ? 'none' : '2px solid #ddd',
                            fontWeight: activeTab === 'infrastructure' ? 'bold' : 'normal',
                            transition: 'all 0.2s ease',
                            marginRight: '4px'
                        }}
                    >
                        Infrastructure (Servers & Groups)
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            backgroundColor: activeTab === 'data' ? '#722f37' : '#f5f5f5', // Burgundy
                            color: activeTab === 'data' ? '#fff' : '#333',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'data' ? 'none' : '2px solid #ddd',
                            fontWeight: activeTab === 'data' ? 'bold' : 'normal',
                            transition: 'all 0.2s ease',
                            marginRight: '4px'
                        }}
                    >
                        Data (Databases & Forests)
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            backgroundColor: activeTab === 'users' ? '#2d5016' : '#f5f5f5', // Deep forest green
                            color: activeTab === 'users' ? '#fff' : '#333',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'users' ? 'none' : '2px solid #ddd',
                            fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                            transition: 'all 0.2s ease',
                            marginRight: '4px'
                        }}
                    >
                        Security (Users & Roles)
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('logs');
                            // Fetch logs when the tab is clicked if not already loaded
                            if (!logs && !logsLoading) {
                                setLogsLoading(true);
                                fetch('http://localhost:8080/manage/v2/logs?filename=ErrorLog.txt&format=text', {
                                    method: 'GET',
                                    headers: { 'Accept': 'text/plain' }
                                })
                                    .then(res => {
                                        if (!res.ok) {
                                            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                                        }
                                        return res.text();
                                    })
                                    .then(data => {
                                        setLogs(data);
                                        setLogsError(null);
                                    })
                                    .catch(e => {
                                        setLogsError(e.message);
                                    })
                                    .finally(() => {
                                        setLogsLoading(false);
                                    });
                            }
                        }}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            backgroundColor: activeTab === 'logs' ? '#8B4513' : '#f5f5f5', // Brown for logs
                            color: activeTab === 'logs' ? '#fff' : '#333',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'logs' ? 'none' : '2px solid #ddd',
                            fontWeight: activeTab === 'logs' ? 'bold' : 'normal',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Logs
                    </button>
                </div>

                {/* Tab Content */}
                <div style={{ textAlign: 'left' }}>
                    {activeTab === 'infrastructure' && (
                        <InfrastructureTab
                            servers={servers}
                            serverDetails={serverDetails}
                            hoveredServer={serverHover.hoveredItem}
                            setHoveredServer={serverHover.setHoveredItem}
                            groups={groups}
                            groupDetails={groupDetails}
                            hoveredGroup={groupHover.hoveredItem}
                            setHoveredGroup={groupHover.setHoveredItem}
                            onDatabaseClick={(_databaseName) => {
                                setActiveTab('data');
                                // Could add logic to highlight the specific database
                            }}
                        />
                    )}

                    {activeTab === 'data' && (
                        <DataTab
                            databases={databases}
                            databaseDetails={databaseDetails}
                            forests={forests}
                            forestDetails={forestDetails}
                            hoveredDatabase={databaseHover.hoveredItem}
                            setHoveredDatabase={databaseHover.setHoveredItem}
                            hoveredForest={forestHover.hoveredItem}
                            setHoveredForest={forestHover.setHoveredItem}
                        />
                    )}

                    {activeTab === 'users' && (
                        <SecurityTab
                            users={users}
                            roles={roles}
                            userDetails={userDetails}
                            roleDetails={roleDetails}
                            hoveredUser={userHover.hoveredItem}
                            setHoveredUser={userHover.setHoveredItem}
                            hoveredRole={roleHover.hoveredItem}
                            setHoveredRole={roleHover.setHoveredItem}
                        />
                    )}

                    {activeTab === 'logs' && (
                        <LogsTab
                            logs={logs}
                            error={logsError}
                            loading={logsLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;
