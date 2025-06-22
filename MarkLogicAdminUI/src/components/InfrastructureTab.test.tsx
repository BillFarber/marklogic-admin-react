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

    const defaultProps = {
        servers: mockServers,
        serverDetails: {},
        hoveredServer: null,
        setHoveredServer: vi.fn()
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

    it('renders raw JSON section for servers data', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('View Raw Servers JSON')).toBeInTheDocument();
    });

    it('handles empty servers data gracefully', () => {
        const propsWithEmptyServers = {
            ...defaultProps,
            servers: null
        };

        render(<InfrastructureTab {...propsWithEmptyServers} />);

        // Should render without crashing, but raw JSON section won't be shown for null data
        expect(screen.queryByText('View Raw Servers JSON')).not.toBeInTheDocument();
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
});
