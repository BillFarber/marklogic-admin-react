import React from 'react';
import { HostItem } from './HostItem';

interface HostsSectionProps {
    hosts: any;
    hostDetails: Record<string, any>;
    hoveredHost: string | null;
    setHoveredHost: (host: string | null) => void;
}

export const HostsSection = React.memo(function HostsSection({ hosts, hostDetails, hoveredHost, setHoveredHost }: HostsSectionProps) {
    if (!hosts || !Array.isArray(hosts['host-default-list']?.['list-items']?.['list-item'])) {
        return null;
    }

    const hostsList = hosts['host-default-list']['list-items']['list-item'].filter((host: any) => host.nameref);

    return (
        <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
            <h2>Hosts</h2>
            <ul style={{
                background: '#34495e', // Rich blue-grey (same as servers/groups)
                color: '#fff',
                padding: 16,
                borderRadius: 8,
                listStyle: 'none',
                margin: 0
            }}>
                {hostsList.map((host: any, idx: number) => (
                    <HostItem
                        key={host.nameref || idx}
                        host={host}
                        hostDetails={hostDetails}
                        hoveredHost={hoveredHost}
                        setHoveredHost={setHoveredHost}
                    />
                ))}
            </ul>
        </section>
    );
});
