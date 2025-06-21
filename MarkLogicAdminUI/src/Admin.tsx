import React from 'react';

function Admin() {
    const [databases, setDatabases] = React.useState<any>(null);
    const [databaseDetails, setDatabaseDetails] = React.useState<Record<string, any>>({});
    const [forests, setForests] = React.useState<any>(null);
    const [forestDetails, setForestDetails] = React.useState<Record<string, any>>({});
    const [servers, setServers] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [hoveredDatabase, setHoveredDatabase] = React.useState<string | null>(null);
    const [hoveredForest, setHoveredForest] = React.useState<string | null>(null);
    const [hoveredServer, setHoveredServer] = React.useState<string | null>(null);

    React.useEffect(() => {
        document.title = 'MarkLogic Admin';

        // Make requests to databases, forests, and servers endpoints
        const databasesUrl = 'http://localhost:8080/manage/v2/databases';
        const forestsUrl = 'http://localhost:8080/manage/v2/forests?format=json';
        const serversUrl = 'http://localhost:8080/manage/v2/servers?format=json';

        // Create promises for all three endpoints
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
            .then(data => setServers(data))
            .catch(e => setError(prev => prev ? `${prev}; Servers: ${e.message}` : `Servers: ${e.message}`));

        // Wait for all requests to complete, then stop loading
        Promise.allSettled([databasesPromise, forestsPromise, serversPromise])
            .then(() => setLoading(false));
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>MarkLogic Admin (Proxy)</h1>
            <p>Welcome to the admin page using Spring Boot proxy.</p>
            {loading && <div>Loading database details...</div>}
            {loading && <div>Loading forests...</div>}
            {loading && <div>Loading servers...</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}

            {/* Databases section */}
            {databases && Array.isArray(databases['database-default-list']?.['list-items']?.['list-item']) && (
                <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <h2>Databases</h2>
                    <ul style={{ background: '#4a2d6b', color: '#fff', padding: 16, borderRadius: 8 }}>
                        {databases['database-default-list']['list-items']['list-item']
                            .filter((db: any) => db.nameref)
                            .map((db: any, idx: number) => {
                                const details = databaseDetails[db.idref];
                                return (
                                    <li key={db.nameref || idx} data-idref={db.idref} style={{
                                        marginBottom: '8px',
                                        position: 'relative',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        backgroundColor: hoveredDatabase === db.idref ? '#5a3d7b' : 'transparent',
                                        transition: 'background-color 0.2s ease'
                                    }}>
                                        <strong
                                            style={{
                                                cursor: 'pointer',
                                                color: hoveredDatabase === db.idref ? '#B39DDB' : '#fff'
                                            }}
                                            onMouseEnter={() => setHoveredDatabase(db.idref)}
                                            onMouseLeave={() => setHoveredDatabase(null)}
                                        >
                                            {db.nameref}
                                        </strong>
                                        {details && (
                                            <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
                                                Status: {details.enabled ? 'Enabled' : 'Disabled'} |
                                                Forests: {Array.isArray(details.forest) ? details.forest.length : 0} |
                                                Security DB: {details['security-database'] || 'N/A'}
                                            </div>
                                        )}
                                        {!details && db.idref && (
                                            <div style={{ fontSize: '0.9em', color: '#999', marginTop: '4px' }}>
                                                Loading details...
                                            </div>
                                        )}

                                        {/* Detailed hover tooltip */}
                                        {hoveredDatabase === db.idref && details && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: '0',
                                                right: '0',
                                                background: '#444',
                                                border: '1px solid #666',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                marginTop: '4px',
                                                zIndex: 1000,
                                                fontSize: '0.85em',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                            }}>
                                                <div><strong>Database ID:</strong> {db.idref}</div>
                                                <div><strong>Name:</strong> {details['database-name'] || db.nameref}</div>
                                                <div><strong>Enabled:</strong> {details.enabled ? 'Yes' : 'No'}</div>
                                                <div><strong>Language:</strong> {details.language || 'N/A'}</div>
                                                <div><strong>Security Database:</strong> {details['security-database'] || 'N/A'}</div>
                                                <div><strong>Schema Database:</strong> {details['schema-database'] || 'N/A'}</div>
                                                <div><strong>Triggers Database:</strong> {details['triggers-database'] || 'N/A'}</div>
                                                <div><strong>Forests:</strong> {Array.isArray(details.forest) ? details.forest.join(', ') : 'None'}</div>
                                                <div><strong>Data Encryption:</strong> {details['data-encryption'] || 'off'}</div>
                                                <div><strong>Stemmed Searches:</strong> {details['stemmed-searches'] ? 'Enabled' : 'Disabled'}</div>
                                                <div><strong>Word Searches:</strong> {details['word-searches'] ? 'Enabled' : 'Disabled'}</div>
                                                {details['retired-forest-count'] > 0 && (
                                                    <div><strong>Retired Forests:</strong> {details['retired-forest-count']}</div>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                    </ul>
                </section>
            )}

            {/* Forests section */}
            {forests && Array.isArray(forests['forest-default-list']?.['list-items']?.['list-item']) && (
                <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <h2>Forests</h2>
                    <ul style={{ background: '#2a4d3a', color: '#fff', padding: 16, borderRadius: 8 }}>
                        {forests['forest-default-list']['list-items']['list-item']
                            .filter((forest: any) => forest.nameref)
                            .map((forest: any, idx: number) => (
                                <li key={forest.nameref || idx} data-idref={forest.idref} style={{
                                    marginBottom: '8px',
                                    position: 'relative',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: hoveredForest === forest.idref ? '#3a5d4a' : 'transparent',
                                    transition: 'background-color 0.2s ease'
                                }}>
                                    <strong
                                        style={{
                                            cursor: 'pointer',
                                            color: hoveredForest === forest.idref ? '#81C784' : '#fff'
                                        }}
                                        onMouseEnter={() => setHoveredForest(forest.idref)}
                                        onMouseLeave={() => setHoveredForest(null)}
                                    >
                                        {forest.nameref}
                                    </strong>
                                    <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
                                        Type: Forest | ID: {forest.idref || 'N/A'}
                                    </div>

                                    {/* Hover tooltip for forests */}
                                    {hoveredForest === forest.idref && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: '0',
                                            backgroundColor: '#1a2f2a',
                                            border: '1px solid #4a6a5a',
                                            borderRadius: '4px',
                                            padding: '8px',
                                            zIndex: 1000,
                                            minWidth: '300px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                        }}>
                                            <div><strong>Forest Details:</strong></div>
                                            <div><strong>Name:</strong> {forest.nameref}</div>
                                            <div><strong>ID:</strong> {forest.idref || 'N/A'}</div>
                                            <div><strong>URI:</strong> {forest.uriref || 'N/A'}</div>

                                            {forestDetails[forest.idref] && (() => {
                                                const details = forestDetails[forest.idref];
                                                const properties = details['forest-properties'] || details;
                                                return (
                                                    <>
                                                        <hr style={{ margin: '8px 0', borderColor: '#4a6a5a' }} />
                                                        <div><strong>Host:</strong> {properties.host || 'N/A'}</div>
                                                        <div><strong>Enabled:</strong> {properties.enabled ? 'Yes' : 'No'}</div>
                                                        <div><strong>Data Directory:</strong> {properties['data-directory'] || 'N/A'}</div>
                                                        {properties['large-data-directory'] && (
                                                            <div><strong>Large Data Directory:</strong> {properties['large-data-directory']}</div>
                                                        )}
                                                        {properties['fast-data-directory'] && (
                                                            <div><strong>Fast Data Directory:</strong> {properties['fast-data-directory']}</div>
                                                        )}
                                                        <div><strong>Updates Allowed:</strong> {properties['updates-allowed'] || 'N/A'}</div>
                                                        <div><strong>Availability:</strong> {properties.availability || 'N/A'}</div>
                                                        {properties['rebalancer-enable'] !== undefined && (
                                                            <div><strong>Rebalancer:</strong> {properties['rebalancer-enable'] ? 'Enabled' : 'Disabled'}</div>
                                                        )}
                                                        {properties.database && (
                                                            <div><strong>Database:</strong> {properties.database}</div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </li>
                            ))}
                    </ul>
                </section>
            )}

            {/* Servers section */}
            {servers && Array.isArray(servers['server-default-list']?.['list-items']?.['list-item']) && (
                <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <h2>Servers</h2>
                    <ul style={{ background: '#2d4a6b', color: '#fff', padding: 16, borderRadius: 8 }}>
                        {servers['server-default-list']['list-items']['list-item']
                            .filter((server: any) => server.nameref)
                            .map((server: any, idx: number) => (
                                <li key={server.nameref || idx} data-idref={server.idref} style={{
                                    marginBottom: '8px',
                                    position: 'relative',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: hoveredServer === server.idref ? '#3d5a7b' : 'transparent',
                                    transition: 'background-color 0.2s ease'
                                }}>
                                    <strong
                                        style={{
                                            cursor: 'pointer',
                                            color: hoveredServer === server.idref ? '#FF7043' : '#fff'
                                        }}
                                        onMouseEnter={() => setHoveredServer(server.idref)}
                                        onMouseLeave={() => setHoveredServer(null)}
                                    >
                                        {server.nameref}
                                    </strong>
                                    <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
                                        Type: {server.kindref || 'N/A'} |
                                        ID: {server.idref} |
                                        Group: {server.groupnameref || 'Default'}
                                    </div>

                                    {/* Detailed hover tooltip */}
                                    {hoveredServer === server.idref && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: '0',
                                            right: '0',
                                            background: '#5a3d3a',
                                            border: '1px solid #777',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginTop: '4px',
                                            zIndex: 1000,
                                            fontSize: '0.85em',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                        }}>
                                            <div><strong>Server ID:</strong> {server.idref}</div>
                                            <div><strong>Name:</strong> {server.nameref}</div>
                                            <div><strong>Type:</strong> {server.kindref || 'N/A'}</div>
                                            <div><strong>Group:</strong> {server.groupnameref || 'Default'}</div>
                                            {server['content-db'] && <div><strong>Content Database:</strong> {server['content-db']}</div>}
                                            {server['modules-db'] && <div><strong>Modules Database:</strong> {server['modules-db']}</div>}
                                        </div>
                                    )}
                                </li>
                            ))}
                    </ul>
                </section>
            )}

            {/* Raw JSON data sections */}
            {databases && (
                <details style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Databases JSON</summary>
                    <pre style={{ background: '#f4f4f4', color: '#333', padding: 16, borderRadius: 8, marginTop: 8 }}>
                        {JSON.stringify(databases, null, 2)}
                    </pre>
                </details>
            )}

            {forests && (
                <details style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Forests JSON</summary>
                    <pre style={{ background: '#f4f4f4', color: '#333', padding: 16, borderRadius: 8, marginTop: 8 }}>
                        {JSON.stringify(forests, null, 2)}
                    </pre>
                </details>
            )}

            {servers && (
                <details style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Servers JSON</summary>
                    <pre style={{ background: '#f4f4f4', color: '#333', padding: 16, borderRadius: 8, marginTop: 8 }}>
                        {JSON.stringify(servers, null, 2)}
                    </pre>
                </details>
            )}

            {/* Raw Database Details section */}
            {Object.keys(databaseDetails).length > 0 && (
                <details style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Database Details JSON</summary>
                    <pre style={{ background: '#f4f4f4', color: '#333', padding: 16, borderRadius: 8, marginTop: 8 }}>
                        {JSON.stringify(databaseDetails, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}

export default Admin;
