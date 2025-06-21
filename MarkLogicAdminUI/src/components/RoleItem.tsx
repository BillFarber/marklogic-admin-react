import React from 'react';

interface RoleItemProps {
    role: any;
    roleDetails: Record<string, any>;
    hoveredRole: string | null;
    setHoveredRole: (role: string | null) => void;
}

export function RoleItem({ role, roleDetails, hoveredRole, setHoveredRole }: RoleItemProps) {
    const isHovered = hoveredRole === role.nameref;

    return (
        <li
            key={role.nameref}
            data-idref={role.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#A0522D' : 'transparent',
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#DEB887' : '#fff'
                }}
                onMouseEnter={() => setHoveredRole(role.nameref)}
                onMouseLeave={() => setHoveredRole(null)}
            >
                {role.nameref}
            </strong>
            <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
                Type: Role | ID: {role.idref || 'N/A'}
                {role.description && ` | ${role.description}`}
            </div>

            {/* Hover tooltip for roles */}
            {isHovered && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    backgroundColor: '#654321',
                    border: '1px solid #8B4513',
                    borderRadius: '4px',
                    padding: '8px',
                    zIndex: 1000,
                    minWidth: '300px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    <div><strong>Role Details:</strong></div>
                    <div><strong>Name:</strong> {role.nameref}</div>
                    <div><strong>ID:</strong> {role.idref || 'N/A'}</div>
                    <div><strong>URI:</strong> {role.uriref || 'N/A'}</div>
                    {role.description && <div><strong>Description:</strong> {role.description}</div>}

                    {roleDetails[role.nameref] && (() => {
                        const details = roleDetails[role.nameref];
                        return (
                            <>
                                <hr style={{ margin: '8px 0', borderColor: '#8B4513' }} />
                                <div><strong>Role Properties:</strong></div>
                                <div><strong>Role Name:</strong> {details['role-name']}</div>
                                {details.description && <div><strong>Description:</strong> {details.description}</div>}
                                {details.compartment && <div><strong>Compartment:</strong> {details.compartment}</div>}
                                {details.roles && Array.isArray(details.roles?.role) && (
                                    <div><strong>Assigned Roles:</strong> {details.roles.role.join(', ')}</div>
                                )}
                                {details.roles && !Array.isArray(details.roles?.role) && details.roles?.role && (
                                    <div><strong>Assigned Role:</strong> {details.roles.role}</div>
                                )}
                                {details['external-names'] && (
                                    <div><strong>External Names:</strong> {JSON.stringify(details['external-names'])}</div>
                                )}
                                {details.permissions && (
                                    <div><strong>Permissions:</strong> {JSON.stringify(details.permissions)}</div>
                                )}
                                {details.privilege && Array.isArray(details.privilege) && (
                                    <div><strong>Privileges:</strong> {details.privilege.length} privilege(s)</div>
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
