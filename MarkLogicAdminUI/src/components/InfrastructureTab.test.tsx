import { render, screen } from '@testing-library/react';
import { InfrastructureTab } from './InfrastructureTab';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('InfrastructureTab', () => {
    const mockServers = {
        'server-default-list': {
            'list-items': {
                'list-item': [
                    { nameref: 'Admin', uriref: '/manage/v2/servers/Admin' },
                    { nameref: 'App-Services', uriref: '/manage/v2/servers/App-Services' }
                ]
            }
        }
    };

    const mockGroups = {
        'group-default-list': {
            'list-items': {
                'list-item': [
                    { nameref: 'Default', idref: 'group-1' },
                    { nameref: 'Analytics', idref: 'group-2' }
                ]
            }
        }
    };

    const defaultProps = {
        servers: mockServers,
        serverDetails: {},
        hoveredServer: null,
        setHoveredServer: vi.fn(),
        groups: mockGroups,
        groupDetails: {},
        hoveredGroup: null,
        setHoveredGroup: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders servers section when servers data is provided', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('Servers')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('App-Services')).toBeInTheDocument();
    });

    it('renders groups section when groups data is provided', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('Groups')).toBeInTheDocument();
        expect(screen.getByText('Default')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('renders raw JSON sections for both servers and groups data', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('View Raw Servers JSON')).toBeInTheDocument();
        expect(screen.getByText('View Raw Groups JSON')).toBeInTheDocument();
    });

    it('handles empty servers data gracefully', () => {
        const propsWithEmptyServers = {
            ...defaultProps,
            servers: null
        };

        render(<InfrastructureTab {...propsWithEmptyServers} />);

        // Should render groups but not servers
        expect(screen.getByText('Groups')).toBeInTheDocument();
        expect(screen.queryByText('Servers')).not.toBeInTheDocument();
        expect(screen.getByText('View Raw Groups JSON')).toBeInTheDocument();
        expect(screen.queryByText('View Raw Servers JSON')).not.toBeInTheDocument();
    });

    it('handles empty groups data gracefully', () => {
        const propsWithEmptyGroups = {
            ...defaultProps,
            groups: null
        };

        render(<InfrastructureTab {...propsWithEmptyGroups} />);

        // Should render servers but not groups
        expect(screen.getByText('Servers')).toBeInTheDocument();
        expect(screen.queryByText('Groups')).not.toBeInTheDocument();
        expect(screen.getByText('View Raw Servers JSON')).toBeInTheDocument();
        expect(screen.queryByText('View Raw Groups JSON')).not.toBeInTheDocument();
    });

    it('calls setHoveredServer when provided', () => {
        const mockSetHoveredServer = vi.fn();
        const propsWithServerDetails = {
            ...defaultProps,
            setHoveredServer: mockSetHoveredServer,
            serverDetails: {
                'Admin': { 'server-name': 'Admin', 'server-type': 'http' }
            }
        };

        render(<InfrastructureTab {...propsWithServerDetails} />);

        expect(screen.getByText('Servers')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('calls setHoveredGroup when provided', () => {
        const mockSetHoveredGroup = vi.fn();
        const propsWithGroupDetails = {
            ...defaultProps,
            setHoveredGroup: mockSetHoveredGroup,
            groupDetails: {
                'Default': { 'group-name': 'Default', 'group-id': 'group-1' }
            }
        };

        render(<InfrastructureTab {...propsWithGroupDetails} />);

        expect(screen.getByText('Groups')).toBeInTheDocument();
        expect(screen.getByText('Default')).toBeInTheDocument();
    });
});
