import React from 'react';
import { ServerItem } from './ServerItem';

interface ServersSectionProps {
    servers: any;
    serverDetails: Record<string, any>;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
}

export function ServersSection({ servers, serverDetails, hoveredServer, setHoveredServer }: ServersSectionProps) {
    if (!servers || !Array.isArray(servers['server-default-list']?.['list-items']?.['list-item'])) {
        return null;
    }

    const serversList = servers['server-default-list']['list-items']['list-item'].filter((server: any) => server.nameref);

    return (
        <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <h2>Servers</h2>
            <ul style={{
                background: '#34495e', // Rich blue-grey
                color: '#fff',
                padding: 16,
                borderRadius: 8,
                listStyle: 'none',
                margin: 0
            }}>
                {serversList.map((server: any, idx: number) => (
                    <ServerItem
                        key={server.nameref || idx}
                        server={server}
                        serverDetails={serverDetails}
                        hoveredServer={hoveredServer}
                        setHoveredServer={setHoveredServer}
                    />
                ))}
            </ul>
        </section>
    );
}
