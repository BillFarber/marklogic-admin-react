import React from 'react';

import type { InfrastructureTabProps } from '../types/marklogic';
import { ServersSection } from './ServersSection';
import { GroupsSection } from './GroupsSection';
import { HostsSection } from './HostsSection';
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
  hosts,
  hostDetails,
  hoveredHost,
  setHoveredHost,
  onDatabaseClick,
}: InfrastructureTabProps) {
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
          <GroupsSection
            groups={groups}
            groupDetails={groupDetails}
            hoveredGroup={hoveredGroup}
            setHoveredGroup={setHoveredGroup}
          />
        </div>

        <div style={{ flex: '1', minWidth: '300px' }}>
          <HostsSection
            hosts={hosts}
            hostDetails={hostDetails}
            hoveredHost={hoveredHost}
            setHoveredHost={setHoveredHost}
          />
        </div>

        <div style={{ flex: '1', minWidth: '300px' }}>
          <ServersSection
            servers={servers}
            serverDetails={serverDetails}
            hoveredServer={hoveredServer}
            setHoveredServer={setHoveredServer}
            onDatabaseClick={onDatabaseClick}
          />
        </div>
      </div>

      {/* Raw JSON data sections for Infrastructure */}
      <RawJsonSection data={groups} title="View Raw Groups JSON" />

      <RawJsonSection data={hosts} title="View Raw Hosts JSON" />

      <RawJsonSection data={servers} title="View Raw Servers JSON" />
    </div>
  );
}
