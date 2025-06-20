import React from 'react';

interface DatabaseItemProps {
    database: any;
    databaseDetails: Record<string, any>;
    hoveredDatabase: string | null;
    setHoveredDatabase: (db: string | null) => void;
}

export function DatabaseItem({ database, databaseDetails, hoveredDatabase, setHoveredDatabase }: DatabaseItemProps) {
    const details = databaseDetails[database.idref];
    const isHovered = hoveredDatabase === database.idref;

    return (
        <li
            key={database.nameref}
            data-idref={database.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#5a3d7b' : 'transparent',
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#B39DDB' : '#fff'
                }}
                onMouseEnter={() => setHoveredDatabase(database.idref)}
                onMouseLeave={() => setHoveredDatabase(null)}
            >
                {database.nameref}
            </strong>
            {details && (
                <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
                    Status: {details.enabled ? 'Enabled' : 'Disabled'} |
                    Forests: {Array.isArray(details.forest) ? details.forest.length : 0} |
                    Security DB: {details['security-database'] || 'N/A'}
                </div>
            )}
            {!details && database.idref && (
                <div style={{ fontSize: '0.9em', color: '#999', marginTop: '4px' }}>
                    Loading details...
                </div>
            )}

            {/* Detailed hover tooltip */}
            {isHovered && details && (
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
                    <div><strong>Database ID:</strong> {database.idref}</div>
                    <div><strong>Name:</strong> {details['database-name'] || database.nameref}</div>
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
}
