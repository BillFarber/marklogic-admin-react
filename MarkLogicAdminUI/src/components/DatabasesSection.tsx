import React from 'react';

import type { DatabasesSectionProps } from '../types/marklogic';
import { DatabaseItem } from './DatabaseItem';

export const DatabasesSection = React.memo(function DatabasesSection({ databases, databaseDetails, hoveredDatabase, setHoveredDatabase }: DatabasesSectionProps) {
    if (!databases || !Array.isArray(databases['database-default-list']?.['list-items']?.['list-item'])) {
        return null;
    }

    const databasesList = databases['database-default-list']['list-items']['list-item'].filter((db: any) => db.nameref);

    return (
        <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <h2>Databases</h2>
            <ul style={{
                background: '#8b2635', // Rich burgundy
                color: '#fff',
                padding: 16,
                borderRadius: 8,
                listStyle: 'none',
                margin: 0
            }}>
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
