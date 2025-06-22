import React from 'react';

import type { RawJsonSectionProps } from '../types/marklogic';

export function RawJsonSection({ data, title }: RawJsonSectionProps) {
    if (!data) {
        return null;
    }

    return (
        <details style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>{title}</summary>
            <pre style={{
                background: '#f4f4f4',
                color: '#333',
                padding: 16,
                borderRadius: 8,
                marginTop: 8,
                overflow: 'auto',
                fontSize: '12px'
            }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </details>
    );
}
