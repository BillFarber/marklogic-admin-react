import React from 'react';

export interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any;
    type: 'database' | 'forest' | 'server' | 'group' | 'user' | 'role';
}

export const DetailsModal = React.memo(function DetailsModal({
    isOpen,
    onClose,
    title,
    data,
    type
}: DetailsModalProps) {
    if (!isOpen || !data) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'database': return '#8b6914'; // Amber/golden
            case 'forest': return '#8b6914'; // Amber/golden
            case 'server': return '#8b6914'; // Amber/golden
            case 'group': return '#5a6c7d'; // Blue-grey
            case 'user': return '#4a7c59'; // Forest green
            case 'role': return '#8b4513'; // Saddle brown
            default: return '#666';
        }
    };

    const renderContent = () => {
        switch (type) {
            case 'database': {
                return (
                    <div style={{ color: '#333' }}>
                        {Object.keys(data).length > 0 ? (
                            <>
                                <div style={{ marginBottom: '16px' }}><strong>Database Details:</strong></div>

                                {/* Display all database properties dynamically */}
                                {Object.entries(data).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '8px' }}>
                                        <strong>{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                            typeof value === 'object' ? JSON.stringify(value) :
                                                String(value)}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ marginBottom: '16px', color: '#666' }}>
                                No database details available for this database.
                            </div>
                        )}

                        <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />
                        <details style={{ marginTop: '16px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                                Complete JSON Data
                            </summary>
                            <pre style={{
                                background: '#f8f9fa',
                                color: '#212529',
                                padding: '16px',
                                borderRadius: '6px',
                                overflow: 'auto',
                                fontSize: '12px',
                                maxHeight: '400px',
                                border: '1px solid #e9ecef',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </details>
                    </div>
                );
            } case 'forest': {
                const forestDetails = data.forestDetails?.[data.idref] || {};
                return (
                    <div style={{ color: '#333' }}>
                        {Object.keys(forestDetails).length > 0 ? (
                            <>
                                <div style={{ marginBottom: '16px' }}><strong>Forest Details:</strong></div>

                                {/* Display all forestDetails properties dynamically */}
                                {Object.entries(forestDetails).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '8px' }}>
                                        <strong>{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                            typeof value === 'object' ? JSON.stringify(value) :
                                                String(value)}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ marginBottom: '16px', color: '#666' }}>
                                No forest details available for this forest.
                            </div>
                        )}

                        <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />
                        <details style={{ marginTop: '16px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                                Complete JSON Data
                            </summary>
                            <pre style={{
                                background: '#f8f9fa',
                                color: '#212529',
                                padding: '16px',
                                borderRadius: '6px',
                                overflow: 'auto',
                                fontSize: '12px',
                                maxHeight: '400px',
                                border: '1px solid #e9ecef',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify({ ...data, forestDetails }, null, 2)}
                            </pre>
                        </details>
                    </div>
                );
            }

            case 'server': {
                const serverDetails = data.serverDetails?.[data.nameref] || {};
                // Combine basic server properties with detailed properties
                const allServerProperties = {
                    ...data, // Basic server properties (idref, nameref, kindref, etc.)
                    ...serverDetails // Detailed properties from serverDetails
                };
                // Remove serverDetails from the combined object to avoid duplication
                delete allServerProperties.serverDetails;

                return (
                    <div style={{ color: '#333' }}>
                        {Object.keys(allServerProperties).length > 0 ? (
                            <>
                                <div style={{ marginBottom: '16px' }}><strong>Server Details:</strong></div>

                                {/* Display all server properties dynamically */}
                                {Object.entries(allServerProperties).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '8px' }}>
                                        <strong>{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                            typeof value === 'object' ? JSON.stringify(value) :
                                                String(value)}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ marginBottom: '16px', color: '#666' }}>
                                No server details available for this server.
                            </div>
                        )}

                        <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />
                        <details style={{ marginTop: '16px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                                Complete JSON Data
                            </summary>
                            <pre style={{
                                background: '#f8f9fa',
                                color: '#212529',
                                padding: '16px',
                                borderRadius: '6px',
                                overflow: 'auto',
                                fontSize: '12px',
                                maxHeight: '400px',
                                border: '1px solid #e9ecef',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </details>
                    </div>
                );
            }

            case 'user': {
                const userDetails = data.userDetails?.[data.nameref] || {};
                return (
                    <div style={{ color: '#333' }}>
                        {Object.keys(userDetails).length > 0 ? (
                            <>
                                <div style={{ marginBottom: '16px' }}><strong>User Details:</strong></div>

                                {/* Display all userDetails properties dynamically */}
                                {Object.entries(userDetails).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '8px' }}>
                                        <strong>{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                            typeof value === 'object' ? JSON.stringify(value) :
                                                String(value)}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ marginBottom: '16px', color: '#666' }}>
                                No user details available for this user.
                            </div>
                        )}

                        <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />
                        <details style={{ marginTop: '16px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                                Complete JSON Data
                            </summary>
                            <pre style={{
                                background: '#f8f9fa',
                                color: '#212529',
                                padding: '16px',
                                borderRadius: '6px',
                                overflow: 'auto',
                                fontSize: '12px',
                                maxHeight: '400px',
                                border: '1px solid #e9ecef',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify({ ...data, userDetails }, null, 2)}
                            </pre>
                        </details>
                    </div>
                );
            }

            case 'role': {
                const roleDetails = data.roleDetails?.[data.nameref] || {};
                return (
                    <div style={{ color: '#333' }}>
                        {Object.keys(roleDetails).length > 0 ? (
                            <>
                                <div style={{ marginBottom: '16px' }}><strong>Role Details:</strong></div>

                                {/* Display all roleDetails properties dynamically */}
                                {Object.entries(roleDetails).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '8px' }}>
                                        <strong>{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                                        {key === 'privilege' && Array.isArray(value) ?
                                            value.map(p => p['privilege-name'] || p.name || p).join(', ') :
                                            typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                                typeof value === 'object' ? JSON.stringify(value) :
                                                    String(value)}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ marginBottom: '16px', color: '#666' }}>
                                No role details available for this role.
                            </div>
                        )}

                        <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />
                        <details style={{ marginTop: '16px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                                Complete JSON Data
                            </summary>
                            <pre style={{
                                background: '#f8f9fa',
                                color: '#212529',
                                padding: '16px',
                                borderRadius: '6px',
                                overflow: 'auto',
                                fontSize: '12px',
                                maxHeight: '400px',
                                border: '1px solid #e9ecef',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </details>
                    </div>
                );
            } case 'group': {
                const groupDetails = data.groupDetails?.[data.nameref] || {};
                return (
                    <div style={{ color: '#333' }}>
                        {Object.keys(groupDetails).length > 0 ? (
                            <>
                                <div style={{ marginBottom: '16px' }}><strong>Group Details:</strong></div>

                                {/* Display all groupDetails properties dynamically */}
                                {Object.entries(groupDetails).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '8px' }}>
                                        <strong>{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                            typeof value === 'object' ? JSON.stringify(value) :
                                                String(value)}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ marginBottom: '16px', color: '#666' }}>
                                No group details available for this group.
                            </div>
                        )}

                        <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />
                        <details style={{ marginTop: '16px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                                Complete JSON Data
                            </summary>
                            <pre style={{
                                background: '#f8f9fa',
                                color: '#212529',
                                padding: '16px',
                                borderRadius: '6px',
                                overflow: 'auto',
                                fontSize: '12px',
                                maxHeight: '400px',
                                border: '1px solid #e9ecef',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify({ ...data, groupDetails }, null, 2)}
                            </pre>
                        </details>
                    </div>
                );
            }

            default: {
                return (
                    <div style={{ color: '#333' }}>
                        <div style={{ marginBottom: '16px' }}><strong>Raw Data:</strong></div>
                        <pre style={{
                            background: '#f8f9fa',
                            color: '#212529',
                            padding: '16px',
                            borderRadius: '6px',
                            overflow: 'auto',
                            fontSize: '12px',
                            maxHeight: '400px',
                            border: '1px solid #e9ecef',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                );
            }
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px'
            }}
            onClick={handleBackdropClick}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    maxWidth: '800px',
                    maxHeight: '80vh',
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        backgroundColor: getTypeColor(),
                        color: '#fff',
                        padding: '16px 20px',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <h2 id="modal-title" style={{ margin: 0, fontSize: '18px' }}>
                        {title} Details
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '0',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div
                    style={{
                        padding: '20px',
                        overflow: 'auto',
                        maxHeight: 'calc(80vh - 80px)',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#333' // Ensure text is visible
                    }}
                >
                    {renderContent()}
                </div>
            </div>
        </div>
    );
});
