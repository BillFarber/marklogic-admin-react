import React from 'react';

interface ServerItemProps {
    server: any;
    serverDetails: Record<string, any>;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
    onDatabaseClick?: (databaseName: string) => void;
}

export const ServerItem = React.memo(function ServerItem({ server, serverDetails, hoveredServer, setHoveredServer, onDatabaseClick }: ServerItemProps) {
    const isHovered = hoveredServer === server.idref;
    const [hoverTimeout, setHoverTimeout] = React.useState<number | null>(null);

    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setHoveredServer(server.idref);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredServer(null);
        }, 300);
        setHoverTimeout(timeout);
    };

    const handleTooltipMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
    };

    const handleTooltipMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredServer(null);
        }, 100);
        setHoverTimeout(timeout);
    };

    React.useEffect(() => {
        return () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [hoverTimeout]);

    return (
        <li
            key={server.nameref}
            data-idref={server.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#5a6c7d' : 'transparent', // Lighter blue-grey on hover
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#bdc3c7' : '#fff' // Soft blue-grey accent on hover
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        right: '0',
                        background: '#8b6914', // Amber/golden background
                        border: '1px solid #b8860b',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '4px',
                        zIndex: 1000,
                        fontSize: '0.85em',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        cursor: 'default',
                        userSelect: 'text'
                    }}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div><strong>Server ID:</strong> {server.idref}</div>
                    <div><strong>Name:</strong> {server.nameref}</div>
                    <div><strong>Type:</strong> {server.kindref || 'N/A'}</div>
                    <div><strong>Group:</strong> {server.groupnameref || 'Default'}</div>
                    {server['content-db'] && (
                        <div>
                            <strong>Content Database:</strong>{' '}
                            <span
                                style={{
                                    color: '#3498db',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDatabaseClick) {
                                        onDatabaseClick(server['content-db']);
                                    }
                                }}
                            >
                                {server['content-db']}
                            </span>
                        </div>
                    )}
                    {server['modules-db'] && (
                        <div>
                            <strong>Modules Database:</strong>{' '}
                            <span
                                style={{
                                    color: '#3498db',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDatabaseClick) {
                                        onDatabaseClick(server['modules-db']);
                                    }
                                }}
                            >
                                {server['modules-db']}
                            </span>
                        </div>
                    )}

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
                                {details['content-database'] && (
                                    <div>
                                        <strong>Content Database:</strong>{' '}
                                        <span
                                            style={{
                                                color: '#3498db',
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onDatabaseClick) {
                                                    onDatabaseClick(details['content-database']);
                                                }
                                            }}
                                        >
                                            {details['content-database']}
                                        </span>
                                    </div>
                                )}
                                {details['modules-database'] && (
                                    <div>
                                        <strong>Modules Database:</strong>{' '}
                                        <span
                                            style={{
                                                color: '#3498db',
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onDatabaseClick) {
                                                    onDatabaseClick(details['modules-database']);
                                                }
                                            }}
                                        >
                                            {details['modules-database']}
                                        </span>
                                    </div>
                                )}
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
});
