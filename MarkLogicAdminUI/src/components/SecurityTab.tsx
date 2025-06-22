import React from 'react';
import { UsersSection } from './UsersSection';
import { RolesSection } from './RolesSection';
import { RawJsonSection } from './RawJsonSection';

interface SecurityTabProps {
    users: any;
    roles: any;
    userDetails: Record<string, any>;
    roleDetails: Record<string, any>;
    hoveredUser: string | null;
    setHoveredUser: (user: string | null) => void;
    hoveredRole: string | null;
    setHoveredRole: (role: string | null) => void;
}

export function SecurityTab({
    users,
    roles,
    userDetails,
    roleDetails,
    hoveredUser,
    setHoveredUser,
    hoveredRole,
    setHoveredRole
}: SecurityTabProps) {
    return (
        <div>
            {/* Main sections side-by-side */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <UsersSection
                        users={users}
                        userDetails={userDetails}
                        hoveredUser={hoveredUser}
                        setHoveredUser={setHoveredUser}
                    />
                </div>

                <div style={{ flex: '1', minWidth: '300px' }}>
                    <RolesSection
                        roles={roles}
                        roleDetails={roleDetails}
                        hoveredRole={hoveredRole}
                        setHoveredRole={setHoveredRole}
                    />
                </div>
            </div>

            {/* Raw JSON data sections for Users */}
            <RawJsonSection
                data={users}
                title="View Raw Users JSON"
            />

            {/* Raw User Details section */}
            {Object.keys(userDetails).length > 0 && (
                <RawJsonSection
                    data={userDetails}
                    title="View Raw User Details JSON"
                />
            )}

            {/* Raw JSON data sections for Roles */}
            <RawJsonSection
                data={roles}
                title="View Raw Roles JSON"
            />

            {/* Raw Role Details section */}
            {Object.keys(roleDetails).length > 0 && (
                <RawJsonSection
                    data={roleDetails}
                    title="View Raw Role Details JSON"
                />
            )}
        </div>
    );
}
