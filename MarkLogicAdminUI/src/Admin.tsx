import React from 'react';
import { SecurityTab, DataTab, InfrastructureTab } from './components';

function Admin() {
    const [databases, setDatabases] = React.useState<any>(null);
    const [databaseDetails, setDatabaseDetails] = React.useState<Record<string, any>>({});
    const [forests, setForests] = React.useState<any>(null);
    const [forestDetails, setForestDetails] = React.useState<Record<string, any>>({});
    const [servers, setServers] = React.useState<any>(null);
    const [serverDetails, setServerDetails] = React.useState<Record<string, any>>({});
    const [users, setUsers] = React.useState<any>(null);
    const [userDetails, setUserDetails] = React.useState<Record<string, any>>({});
    const [roles, setRoles] = React.useState<any>(null);
    const [roleDetails, setRoleDetails] = React.useState<Record<string, any>>({});
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [hoveredDatabase, setHoveredDatabase] = React.useState<string | null>(null);
    const [hoveredForest, setHoveredForest] = React.useState<string | null>(null);
    const [hoveredServer, setHoveredServer] = React.useState<string | null>(null);
    const [hoveredUser, setHoveredUser] = React.useState<string | null>(null);
    const [hoveredRole, setHoveredRole] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState<string>('data');

    React.useEffect(() => {
        document.title = 'MarkLogic Admin';

        // Make requests to databases, forests, servers, users, and roles endpoints
        const databasesUrl = 'http://localhost:8080/manage/v2/databases';
        const forestsUrl = 'http://localhost:8080/manage/v2/forests?format=json';
        const serversUrl = 'http://localhost:8080/manage/v2/servers?format=json';
        const usersUrl = 'http://localhost:8080/manage/v2/users?format=json';
        const rolesUrl = 'http://localhost:8080/manage/v2/roles?format=json';

        // Create promises for all five endpoints
        const databasesPromise = fetch(databasesUrl, {
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
                setDatabases(data);

                // Fetch details for each database using idref
                if (data && Array.isArray(data['database-default-list']?.['list-items']?.['list-item'])) {
                    const dbList = data['database-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each database in parallel
                    const detailPromises = dbList
                        .filter((db: any) => db.idref)
                        .map(async (db: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/databases/${db.idref}/properties?format=json`;
                                const response = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (response.ok) {
                                    const detailData = await response.json();
                                    details[db.idref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for database ${db.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setDatabaseDetails(details);
                }
            })
            .catch(e => setError(e.message));

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

        // Wait for all requests to complete, then stop loading
        Promise.allSettled([databasesPromise, forestsPromise, serversPromise, usersPromise, rolesPromise])
            .then(() => setLoading(false));
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>MarkLogic Admin (Proxy)</h1>
            <p>Welcome to the admin page using Spring Boot proxy.</p>

            {/* Loading and Error States */}
            {loading && (
                <div style={{ marginBottom: '1rem' }}>
                    <div>Loading database details...</div>
                    <div>Loading forests...</div>
                    <div>Loading servers...</div>
                    <div>Loading users...</div>
                    <div>Loading roles...</div>
                </div>
            )}
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

            {/* Tab Navigation */}
            <div style={{ margin: '2rem auto', maxWidth: 1000 }}>
                <div style={{
                    display: 'flex',
                    borderBottom: '2px solid #ddd',
                    marginBottom: '1rem',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => setActiveTab('data')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            backgroundColor: activeTab === 'data' ? '#4a2d6b' : '#f5f5f5',
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
                        onClick={() => setActiveTab('infrastructure')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            backgroundColor: activeTab === 'infrastructure' ? '#2d6b4a' : '#f5f5f5',
                            color: activeTab === 'infrastructure' ? '#fff' : '#333',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'infrastructure' ? 'none' : '2px solid #ddd',
                            fontWeight: activeTab === 'infrastructure' ? 'bold' : 'normal',
                            transition: 'all 0.2s ease',
                            marginRight: '4px'
                        }}
                    >
                        Infrastructure (Servers)
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            backgroundColor: activeTab === 'users' ? '#b04500' : '#f5f5f5',
                            color: activeTab === 'users' ? '#fff' : '#333',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'users' ? 'none' : '2px solid #ddd',
                            fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Security (Users & Roles)
                    </button>
                </div>

                {/* Tab Content */}
                <div style={{ textAlign: 'left' }}>
                    {activeTab === 'data' && (
                        <DataTab
                            databases={databases}
                            databaseDetails={databaseDetails}
                            forests={forests}
                            forestDetails={forestDetails}
                            hoveredDatabase={hoveredDatabase}
                            setHoveredDatabase={setHoveredDatabase}
                            hoveredForest={hoveredForest}
                            setHoveredForest={setHoveredForest}
                        />
                    )}

                    {activeTab === 'infrastructure' && (
                        <InfrastructureTab
                            servers={servers}
                            serverDetails={serverDetails}
                            hoveredServer={hoveredServer}
                            setHoveredServer={setHoveredServer}
                        />
                    )}

                    {activeTab === 'users' && (
                        <SecurityTab
                            users={users}
                            roles={roles}
                            userDetails={userDetails}
                            roleDetails={roleDetails}
                            hoveredUser={hoveredUser}
                            setHoveredUser={setHoveredUser}
                            hoveredRole={hoveredRole}
                            setHoveredRole={setHoveredRole}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;
