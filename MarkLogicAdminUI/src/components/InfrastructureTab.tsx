import React from 'react';
import { ServersSection } from './ServersSection';
import { RawJsonSection } from './RawJsonSection';

interface InfrastructureTabProps {
    servers: any;
    serverDetails: Record<string, any>;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
}

export function InfrastructureTab({
    servers,
    serverDetails,
    hoveredServer,
    setHoveredServer
}: InfrastructureTabProps) {
    return (
        <div>
            <ServersSection
                servers={servers}
                serverDetails={serverDetails}
                hoveredServer={hoveredServer}
                setHoveredServer={setHoveredServer}
            />

            {/* Raw JSON data sections for Infrastructure */}
            <RawJsonSection
                data={servers}
                title="View Raw Servers JSON"
            />
        </div>
    );
}
