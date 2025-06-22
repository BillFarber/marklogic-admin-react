import React from 'react';
import { RoleItem } from './RoleItem';

interface RolesSectionProps {
    roles: any;
    roleDetails: Record<string, any>;
    hoveredRole: string | null;
    setHoveredRole: (role: string | null) => void;
}

export const RolesSection = React.memo(function RolesSection({ roles, roleDetails, hoveredRole, setHoveredRole }: RolesSectionProps) {
    if (!roles || !Array.isArray(roles['role-default-list']?.['list-items']?.['list-item'])) {
        return null;
    }

    const rolesList = roles['role-default-list']['list-items']['list-item'].filter((role: any) => role.nameref);

    return (
        <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <h2>Roles</h2>
            <ul style={{
                background: '#2d5016', // Deep forest green to match tab
                color: '#fff',
                padding: 16,
                borderRadius: 8,
                listStyle: 'none',
                margin: 0
            }}>
                {rolesList.map((role: any, idx: number) => (
                    <RoleItem
                        key={role.nameref || idx}
                        role={role}
                        roleDetails={roleDetails}
                        hoveredRole={hoveredRole}
                        setHoveredRole={setHoveredRole}
                    />
                ))}
            </ul>
        </section>
    );
});
