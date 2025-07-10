import React from 'react';

import type { DatabasesSectionProps } from '../types/marklogic';
import { isEmpty } from '../utils';
import { DatabaseItem } from './DatabaseItem';
import { EmptyState } from './ui';

export const DatabasesSection = React.memo(function DatabasesSection({
  databases,
  databaseDetails,
  hoveredDatabase,
  setHoveredDatabase,
}: DatabasesSectionProps) {
  if (
    !databases ||
    !Array.isArray(
      databases['database-default-list']?.['list-items']?.['list-item'],
    )
  ) {
    return (
      <section
        style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}
      >
        <h2>Databases</h2>
        <EmptyState
          title="No databases found"
          description="There are currently no databases to display."
        />
      </section>
    );
  }

  const databasesList = databases['database-default-list']['list-items'][
    'list-item'
  ].filter((db: any) => db.nameref);

  if (isEmpty(databasesList)) {
    return (
      <section
        style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}
      >
        <h2>Databases</h2>
        <EmptyState
          title="No databases available"
          description="All databases have been filtered out or are not accessible."
        />
      </section>
    );
  }

  return (
    <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
      <h2>Databases</h2>
      <ul
        style={{
          background: '#8b2635', // Rich burgundy
          color: '#fff',
          padding: 16,
          borderRadius: 8,
          listStyle: 'none',
          margin: 0,
        }}
      >
        {databasesList.map((database: any, idx: number) => (
          <DatabaseItem
            key={database.nameref || idx}
            database={database}
            databaseDetails={databaseDetails}
            hoveredDatabase={hoveredDatabase}
            setHoveredDatabase={setHoveredDatabase}
          />
        ))}
      </ul>
    </section>
  );
});
