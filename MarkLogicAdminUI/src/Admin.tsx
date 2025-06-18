import React from 'react';

function Admin() {
    const [databases, setDatabases] = React.useState<any>(null);
    const [forests, setForests] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);
    React.useEffect(() => {
        document.title = 'MarkLogic Admin';

        // Make requests to both databases and forests endpoints
        const databasesUrl = 'http://localhost:8080/manage/v2/databases';
        const forestsUrl = 'http://localhost:8080/manage/v2/forests?format=json';

        // Fetch databases
        fetch(databasesUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => setDatabases(data))
            .catch(e => setError(e.message));

        // Fetch forests
        fetch(forestsUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => setForests(data))
            .catch(e => setError(prev => prev ? `${prev}; Forests: ${e.message}` : `Forests: ${e.message}`));
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>MarkLogic Admin (Proxy)</h1>
            <p>Welcome to the admin page using Spring Boot proxy.</p>
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}

            {/* Databases section */}
            {databases && Array.isArray(databases['database-default-list']?.['list-items']?.['list-item']) && (
                <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <h2>Databases</h2>
                    <ul style={{ background: '#222', color: '#fff', padding: 16, borderRadius: 8 }}>
                        {databases['database-default-list']['list-items']['list-item']
                            .filter((db: any) => db.nameref)
                            .map((db: any, idx: number) => (
                                <li key={db.nameref || idx}>{db.nameref}</li>
                            ))}
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
                                <li key={forest.nameref || idx}>{forest.nameref}</li>
                            ))}
                    </ul>
                </section>
            )}

            {/* Raw JSON data sections */}
            {databases ? (
                <details style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Databases JSON</summary>
                    <pre style={{ background: '#f4f4f4', color: '#333', padding: 16, borderRadius: 8, marginTop: 8 }}>
                        {JSON.stringify(databases, null, 2)}
                    </pre>
                </details>
            ) : !error && <div>Loading databases...</div>}

            {forests ? (
                <details style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Raw Forests JSON</summary>
                    <pre style={{ background: '#f4f4f4', color: '#333', padding: 16, borderRadius: 8, marginTop: 8 }}>
                        {JSON.stringify(forests, null, 2)}
                    </pre>
                </details>
            ) : !error && <div>Loading forests...</div>}
        </div>
    );
}

export default Admin;
