import React from 'react';

import type { DatabaseItemProps } from '../types/marklogic';

export function DatabaseItem({ database, databaseDetails, hoveredDatabase, setHoveredDatabase }: DatabaseItemProps) {
    const databaseId = database.idref || database.nameref;
    const details = databaseDetails[databaseId];
    const isHovered = hoveredDatabase === databaseId;
    const [hoverTimeout, setHoverTimeout] = React.useState<number | null>(null);

    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setHoveredDatabase(databaseId);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredDatabase(null);
        }, 300); // 300ms delay before hiding
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
            setHoveredDatabase(null);
        }, 100); // Shorter delay when leaving tooltip
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
            key={database.nameref}
            data-idref={database.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#a0303e' : 'transparent', // Lighter burgundy on hover
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#f8bbd9' : '#fff' // Soft burgundy-pink accent on hover
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
