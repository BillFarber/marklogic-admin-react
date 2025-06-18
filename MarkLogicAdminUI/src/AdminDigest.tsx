import React from 'react';
import { MD5 } from 'crypto-js';

// Utility to parse WWW-Authenticate header for Digest
function parseDigestAuthHeader(header: string) {
    const prefix = 'Digest ';
    if (!header.startsWith(prefix)) return null;
    const params = {} as Record<string, string>;
    header.slice(prefix.length).split(',').forEach(part => {
        const [k, v] = part.trim().split('=');
        params[k] = v.replace(/"/g, '');
    });
    return params;
}

// Utility to create the Digest auth response
function createDigestResponse({ username, password, method, uri, params }: {
    username: string,
    password: string,
    method: string,
    uri: string,
    params: Record<string, string>
}) {
    // Only supports MD5, qop="auth"
    const ha1 = md5(`${username}:${params.realm}:${password}`);
    const ha2 = md5(`${method}:${uri}`);
    const cnonce = Math.random().toString(36).substring(2, 14);
    const nc = '00000001';
    const response = md5([
        ha1,
        params.nonce,
        nc,
        cnonce,
        params.qop,
        ha2
    ].join(':'));
    return `Digest username="${username}", realm="${params.realm}", nonce="${params.nonce}", uri="${uri}", algorithm=MD5, response="${response}", qop=${params.qop}, nc=${nc}, cnonce="${cnonce}"`;
}

// Minimal MD5 implementation (browser safe)
function md5(str: string): string {
    return MD5(str).toString();
}

function AdminDigest() {
    const [databases, setDatabases] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);
    React.useEffect(() => {
        document.title = 'MarkLogic Admin (Digest)';
        const username = import.meta.env.VITE_MARKLOGIC_ADMIN_USERNAME;
        const password = import.meta.env.VITE_MARKLOGIC_ADMIN_PASSWORD;
        const url = '/manage/v2/databases';
        // Step 1: Unauthenticated request to get WWW-Authenticate header
        fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
            .then(async res => {
                if (res.status === 200) {
                    // If already authenticated, just return the data
                    return res.json();
                }
                if (res.status !== 401) throw new Error(`Expected 401 or 200, got ${res.status}`);
                const wwwAuth = res.headers.get('www-authenticate');
                if (!wwwAuth) throw new Error('No WWW-Authenticate header');
                const params = parseDigestAuthHeader(wwwAuth);
                if (!params) throw new Error('Failed to parse digest header');
                // Step 2: Authenticated request with Digest
                const authHeader = createDigestResponse({
                    username,
                    password,
                    method: 'GET',
                    uri: url,
                    params
                });
                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': authHeader,
                        'Accept': 'application/json',
                    },
                }).then(authRes => {
                    if (!authRes.ok) throw new Error(`HTTP ${authRes.status}`);
                    return authRes.json();
                });
            })
            .then(data => setDatabases(data))
            .catch(e => setError(e.message));
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>MarkLogic Admin (Digest Auth)</h1>
            <p>Welcome to the admin page using direct Digest authentication.</p>
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {databases ? (
                <pre style={{ textAlign: 'left', maxWidth: 800, margin: '2rem auto', background: '#f4f4f4', padding: 16, borderRadius: 8 }}>
                    {JSON.stringify(databases, null, 2)}
                </pre>
            ) : !error && <div>Loading databases...</div>}
        </div>
    );
}

export default AdminDigest;
