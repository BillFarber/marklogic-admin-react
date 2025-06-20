import React from 'react';
import { DatabaseItem } from './DatabaseItem';

interface DatabasesSectionProps {
    databases: any;
    databaseDetails: Record<string, any>;
    hoveredDatabase: string | null;
    setHoveredDatabase: (db: string | null) => void;
}

export function DatabasesSection({ databases, databaseDetails, hoveredDatabase, setHoveredDatabase }: DatabasesSectionProps) {
    if (!databases || !Array.isArray(databases['database-default-list']?.['list-items']?.['list-item'])) {
        return null;
    }

    const databasesList = databases['database-default-list']['list-items']['list-item'].filter((db: any) => db.nameref);

    return (
        <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <h2>Databases</h2>
            <ul style={{
                background: '#4a2d6b',
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
}
