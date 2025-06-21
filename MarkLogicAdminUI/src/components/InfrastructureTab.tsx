import React from 'react';
import { DatabasesSection } from './DatabasesSection';
import { ForestsSection } from './ForestsSection';
import { ServersSection } from './ServersSection';
import { RawJsonSection } from './RawJsonSection';

interface InfrastructureTabProps {
    databases: any;
    databaseDetails: Record<string, any>;
    forests: any;
    forestDetails: Record<string, any>;
    servers: any;
    serverDetails: Record<string, any>;
    hoveredDatabase: string | null;
    setHoveredDatabase: (db: string | null) => void;
    hoveredForest: string | null;
    setHoveredForest: (forest: string | null) => void;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
}

export function InfrastructureTab({
    databases,
    databaseDetails,
    forests,
    forestDetails,
    servers,
    serverDetails,
    hoveredDatabase,
    setHoveredDatabase,
    hoveredForest,
    setHoveredForest,
    hoveredServer,
    setHoveredServer
}: InfrastructureTabProps) {
    return (
        <div>
            <DatabasesSection
                databases={databases}
                databaseDetails={databaseDetails}
                hoveredDatabase={hoveredDatabase}
                setHoveredDatabase={setHoveredDatabase}
            />

            <ForestsSection
                forests={forests}
                forestDetails={forestDetails}
                hoveredForest={hoveredForest}
                setHoveredForest={setHoveredForest}
            />

            <ServersSection
                servers={servers}
                serverDetails={serverDetails}
                hoveredServer={hoveredServer}
                setHoveredServer={setHoveredServer}
            />

            {/* Raw JSON data sections for Infrastructure */}
            <RawJsonSection
                data={databases}
                title="View Raw Databases JSON"
            />

            <RawJsonSection
                data={forests}
                title="View Raw Forests JSON"
            />

            <RawJsonSection
                data={servers}
                title="View Raw Servers JSON"
            />

            {/* Raw Database Details section */}
            {Object.keys(databaseDetails).length > 0 && (
                <RawJsonSection
                    data={databaseDetails}
                    title="View Raw Database Details JSON"
                />
            )}
        </div>
    );
}
