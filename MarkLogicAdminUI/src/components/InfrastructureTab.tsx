import React from 'react';
import { ServersSection } from './ServersSection';
import { GroupsSection } from './GroupsSection';
import { RawJsonSection } from './RawJsonSection';

interface InfrastructureTabProps {
    servers: any;
    serverDetails: Record<string, any>;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
    groups: any;
    groupDetails: Record<string, any>;
    hoveredGroup: string | null;
    setHoveredGroup: (group: string | null) => void;
}

export function InfrastructureTab({
    servers,
    serverDetails,
    hoveredServer,
    setHoveredServer,
    groups,
    groupDetails,
    hoveredGroup,
    setHoveredGroup
}: InfrastructureTabProps) {
    return (
        <div>
            <ServersSection
                servers={servers}
                serverDetails={serverDetails}
                hoveredServer={hoveredServer}
                setHoveredServer={setHoveredServer}
            />

            <GroupsSection
                groups={groups}
                groupDetails={groupDetails}
                hoveredGroup={hoveredGroup}
                setHoveredGroup={setHoveredGroup}
            />

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
