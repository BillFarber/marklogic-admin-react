import React from 'react';

interface ForestItemProps {
    forest: any;
    forestDetails: Record<string, any>;
    hoveredForest: string | null;
    setHoveredForest: (forest: string | null) => void;
}

export function ForestItem({ forest, forestDetails, hoveredForest, setHoveredForest }: ForestItemProps) {
    const isHovered = hoveredForest === forest.idref;

    return (
        <li
            key={forest.nameref}
            data-idref={forest.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#3a5d4a' : 'transparent',
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#81C784' : '#fff'
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
            {isHovered && (
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
    );
}
