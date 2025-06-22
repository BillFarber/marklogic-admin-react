import React from 'react';
import { DatabasesSection } from './DatabasesSection';
import { ForestsSection } from './ForestsSection';
import { RawJsonSection } from './RawJsonSection';

interface DataTabProps {
    databases: any;
    databaseDetails: Record<string, any>;
    forests: any;
    forestDetails: Record<string, any>;
    hoveredDatabase: string | null;
    setHoveredDatabase: (db: string | null) => void;
    hoveredForest: string | null;
    setHoveredForest: (forest: string | null) => void;
}

export function DataTab({
    databases,
    databaseDetails,
    forests,
    forestDetails,
    hoveredDatabase,
    setHoveredDatabase,
    hoveredForest,
    setHoveredForest
}: DataTabProps) {
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
                    <DatabasesSection
                        databases={databases}
                        databaseDetails={databaseDetails}
                        hoveredDatabase={hoveredDatabase}
                        setHoveredDatabase={setHoveredDatabase}
                    />
                </div>

                <div style={{ flex: '1', minWidth: '300px' }}>
                    <ForestsSection
                        forests={forests}
                        forestDetails={forestDetails}
                        hoveredForest={hoveredForest}
                        setHoveredForest={setHoveredForest}
                    />
                </div>
            </div>

            {/* Raw JSON data sections for Data */}
            <RawJsonSection
                data={databases}
                title="View Raw Databases JSON"
            />

            <RawJsonSection
                data={forests}
                title="View Raw Forests JSON"
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
