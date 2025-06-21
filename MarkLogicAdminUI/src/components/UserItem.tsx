import React from 'react';

interface UserItemProps {
    user: any;
    userDetails: Record<string, any>;
    hoveredUser: string | null;
    setHoveredUser: (user: string | null) => void;
}

export function UserItem({ user, userDetails, hoveredUser, setHoveredUser }: UserItemProps) {
    const isHovered = hoveredUser === user.nameref;
    const [hoverTimeout, setHoverTimeout] = React.useState<number | null>(null);

    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setHoveredUser(user.nameref);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredUser(null);
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
            setHoveredUser(null);
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
            key={user.nameref}
            data-idref={user.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#e66a10' : 'transparent',
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#FFB74D' : '#fff'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {user.nameref}
            </strong>
            <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
                Type: User | ID: {user.idref || 'N/A'}
                {user.description && ` | ${user.description}`}
            </div>

            {/* Hover tooltip for users */}
            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        backgroundColor: '#b04500',
                        border: '1px solid #d45a00',
                        borderRadius: '4px',
                        padding: '8px',
                        zIndex: 1000,
                        minWidth: '300px',
                        cursor: 'default',
                        userSelect: 'text'
                    }}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div><strong>User Details:</strong></div>
                    <div><strong>Name:</strong> {user.nameref}</div>
                    <div><strong>ID:</strong> {user.idref || 'N/A'}</div>
                    <div><strong>URI:</strong> {user.uriref || 'N/A'}</div>
                    {user.description && <div><strong>Description:</strong> {user.description}</div>}

                    {userDetails[user.nameref] && (() => {
                        const details = userDetails[user.nameref];
                        return (
                            <>
                                <hr style={{ margin: '8px 0', borderColor: '#d45a00' }} />
                                <div><strong>User Properties:</strong></div>
                                <div><strong>User Name:</strong> {details['user-name']}</div>
                                {details.description && <div><strong>Description:</strong> {details.description}</div>}
                                {details.role && Array.isArray(details.role) && (
                                    <div><strong>Roles:</strong> {details.role.join(', ')}</div>
                                )}
                                {details.role && !Array.isArray(details.role) && (
                                    <div><strong>Role:</strong> {details.role}</div>
                                )}
                                {details['external-names'] && (
                                    <div><strong>External Names:</strong> {JSON.stringify(details['external-names'])}</div>
                                )}
                                {details.permissions && (
                                    <div><strong>Permissions:</strong> {JSON.stringify(details.permissions)}</div>
                                )}
                                {details.collections && (
                                    <div><strong>Collections:</strong> {JSON.stringify(details.collections)}</div>
                                )}
                            </>
                        );
                    })()}
                </div>
            )}
        </li>
    );
}
