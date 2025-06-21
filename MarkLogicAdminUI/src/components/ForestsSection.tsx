import React from 'react';
import { ForestItem } from './ForestItem';

interface ForestsSectionProps {
    forests: any;
    forestDetails: Record<string, any>;
    hoveredForest: string | null;
    setHoveredForest: (forest: string | null) => void;
}

export function ForestsSection({ forests, forestDetails, hoveredForest, setHoveredForest }: ForestsSectionProps) {
    if (!forests || !Array.isArray(forests['forest-default-list']?.['list-items']?.['list-item'])) {
        return null;
    }

    const forestsList = forests['forest-default-list']['list-items']['list-item'].filter((forest: any) => forest.nameref);

    return (
        <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <h2>Forests</h2>
            <ul style={{
                background: '#2a4d3a',
                color: '#fff',
                padding: 16,
                borderRadius: 8,
                listStyle: 'none',
                margin: 0
            }}>
                {forestsList.map((forest: any, idx: number) => (
                    <ForestItem
                        key={forest.nameref || idx}
                        forest={forest}
                        forestDetails={forestDetails}
                        hoveredForest={hoveredForest}
                        setHoveredForest={setHoveredForest}
                    />
                ))}
            </ul>
        </section>
    );
}
