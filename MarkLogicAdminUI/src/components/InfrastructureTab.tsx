import React from 'react';

import type { InfrastructureTabProps } from '../types/marklogic';
import { ServersSection } from './ServersSection';
import { GroupsSection } from './GroupsSection';
import { RawJsonSection } from './RawJsonSection';

export function InfrastructureTab({
    servers,
    serverDetails,
    hoveredServer,
    setHoveredServer,
    groups,
    groupDetails,
    hoveredGroup,
    setHoveredGroup,
    onDatabaseClick
}: InfrastructureTabProps) {
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
                    <ServersSection
                        servers={servers}
                        serverDetails={serverDetails}
                        hoveredServer={hoveredServer}
                        setHoveredServer={setHoveredServer}
                        onDatabaseClick={onDatabaseClick}
                    />
                </div>

                <div style={{ flex: '1', minWidth: '300px' }}>
                    <GroupsSection
                        groups={groups}
                        groupDetails={groupDetails}
                        hoveredGroup={hoveredGroup}
                        setHoveredGroup={setHoveredGroup}
                    />
                </div>
            </div>

            {/* Raw JSON data sections for Infrastructure */}
            <RawJsonSection
                data={servers}
                title="View Raw Servers JSON"
            />

            <RawJsonSection
                data={groups}
                title="View Raw Groups JSON"
            />
        </div>
    );
}
