import React from 'react';

interface ServerItemProps {
    server: any;
    serverDetails: Record<string, any>;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
}

export function ServerItem({ server, serverDetails, hoveredServer, setHoveredServer }: ServerItemProps) {
    const isHovered = hoveredServer === server.idref;

    return (
        <li
            key={server.nameref}
            data-idref={server.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#3d5a7b' : 'transparent',
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#FF7043' : '#fff'
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
            {isHovered && (
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

                    {/* Server details from properties endpoint */}
                    {serverDetails[server.nameref] && (() => {
                        const details = serverDetails[server.nameref];
                        return (
                            <>
                                <hr style={{ margin: '8px 0', borderColor: '#777' }} />
                                <div><strong>Enabled:</strong> {details.enabled ? 'Yes' : 'No'}</div>
                                {details.port && <div><strong>Port:</strong> {details.port}</div>}
                                {details['server-type'] && <div><strong>Server Type:</strong> {details['server-type']}</div>}
                                {details.authentication && <div><strong>Authentication:</strong> {details.authentication}</div>}
                                {details['content-database'] && <div><strong>Content Database:</strong> {details['content-database']}</div>}
                                {details['modules-database'] && <div><strong>Modules Database:</strong> {details['modules-database']}</div>}
                                {details.root && <div><strong>Root:</strong> {details.root}</div>}
                                {details.threads && <div><strong>Threads:</strong> {details.threads}</div>}
                                {details['request-timeout'] && <div><strong>Request Timeout:</strong> {details['request-timeout']}s</div>}
                                {details['session-timeout'] && <div><strong>Session Timeout:</strong> {details['session-timeout']}s</div>}
                                {details['ssl-hostname'] && <div><strong>SSL Hostname:</strong> {details['ssl-hostname']}</div>}
                                {details['default-user'] && <div><strong>Default User:</strong> {details['default-user']}</div>}
                                {details['public-port'] !== undefined && <div><strong>Public Port:</strong> {details['public-port'] ? 'Yes' : 'No'}</div>}
                            </>
                        );
                    })()}
                </div>
            )}
        </li>
    );
}
