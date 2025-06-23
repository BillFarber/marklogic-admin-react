import React from 'react';
import { DetailsModal } from './DetailsModal';

interface HostItemProps {
    host: any;
    hostDetails: Record<string, any>;
    hoveredHost: string | null;
    setHoveredHost: (host: string | null) => void;
}

export const HostItem = React.memo(function HostItem({ host, hostDetails, hoveredHost, setHoveredHost }: HostItemProps) {
    const isHovered = hoveredHost === host.idref;
    const [hoverTimeout, setHoverTimeout] = React.useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setHoveredHost(host.idref);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredHost(null);
        }, 300);
        setHoverTimeout(timeout);
    };

    const handleTooltipMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
    };

    const handleTooltipMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredHost(null);
        }, 100);
        setHoverTimeout(timeout);
    };

    React.useEffect(() => {
        return () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [hoverTimeout]);

    return (
        <li
            key={host.nameref}
            data-idref={host.idref}
            style={{
                marginBottom: '8px',
                position: 'relative',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: isHovered ? '#5a6c7d' : 'transparent', // Lighter blue-grey on hover
                transition: 'background-color 0.2s ease'
            }}
        >
            <strong
                style={{
                    cursor: 'pointer',
                    color: isHovered ? '#bdc3c7' : '#fff' // Soft blue-grey accent on hover
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {host.nameref}
            </strong>
            <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
                ID: {host.idref}
                {host.groupnameref && ` | Group: ${host.groupnameref}`}
            </div>

            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '8px',
                        backgroundColor: '#2c3e50',
                        color: '#fff',
                        padding: '12px',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        minWidth: '200px',
                        marginTop: '4px',
                        border: '1px solid #34495e'
                    }}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Host: {host.nameref}</div>
                    <div style={{ fontSize: '0.9em' }}>
                        <div><strong>ID:</strong> {host.idref}</div>
                        {host.groupnameref && <div><strong>Group:</strong> {host.groupnameref}</div>}
                        {hostDetails[host.idref] && (
                            <>
                                <div><strong>Host Name:</strong> {hostDetails[host.idref]['host-name'] || 'N/A'}</div>
                                <div><strong>Bind Port:</strong> {hostDetails[host.idref]['bind-port'] || 'N/A'}</div>
                                <div><strong>Foreign Bind Port:</strong> {hostDetails[host.idref]['foreign-bind-port'] || 'N/A'}</div>
                                {hostDetails[host.idref]['zone'] && <div><strong>Zone:</strong> {hostDetails[host.idref]['zone']}</div>}
                                {hostDetails[host.idref]['host-mode'] && <div><strong>Mode:</strong> {hostDetails[host.idref]['host-mode']}</div>}
                                {hostDetails[host.idref]['bootstrap-host'] !== undefined && (
                                    <div><strong>Bootstrap Host:</strong> {hostDetails[host.idref]['bootstrap-host'] ? 'Yes' : 'No'}</div>
                                )}
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            marginTop: '8px',
                            padding: '4px 8px',
                            backgroundColor: '#3498db',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                        }}
                    >
                        View Full Details
                    </button>
                </div>
            )}

            {isModalOpen && (
                <DetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Host Details: ${host.nameref}`}
                    data={hostDetails[host.idref]}
                    type="host"
                />
            )}
        </li>
    );
});
