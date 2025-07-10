import React from 'react';

import type { DataTabProps } from '../types/marklogic';
import { DatabasesSection } from './DatabasesSection';
import { ForestsSection } from './ForestsSection';
import { RawJsonSection } from './RawJsonSection';

export function DataTab({
  databases,
  databaseDetails,
  forests,
  forestDetails,
  hoveredDatabase,
  setHoveredDatabase,
  hoveredForest,
  setHoveredForest,
}: DataTabProps) {
  return (
    <div>
      {/* Main sections side-by-side */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
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
      <RawJsonSection data={databases} title="View Raw Databases JSON" />

      <RawJsonSection data={forests} title="View Raw Forests JSON" />

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
