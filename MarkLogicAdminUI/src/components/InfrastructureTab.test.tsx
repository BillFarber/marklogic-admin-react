import { render, screen } from '@testing-library/react';
import { InfrastructureTab } from './InfrastructureTab';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('InfrastructureTab', () => {
    const mockDatabases = {
        'database-default-list': {
            'list-items': {
                'list-item': [
                    { nameref: 'Documents', uriref: '/manage/v2/databases/Documents' },
                    { nameref: 'Security', uriref: '/manage/v2/databases/Security' }
                ]
            }
        }
    };

    const mockForests = {
        'forest-default-list': {
            'list-items': {
                'list-item': [
                    { nameref: 'Documents', uriref: '/manage/v2/forests/Documents' },
                    { nameref: 'Security', uriref: '/manage/v2/forests/Security' }
                ]
            }
        }
    };

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
        databases: mockDatabases,
        databaseDetails: {},
        forests: mockForests,
        forestDetails: {},
        servers: mockServers,
        serverDetails: {},
        hoveredDatabase: null,
        setHoveredDatabase: vi.fn(),
        hoveredForest: null,
        setHoveredForest: vi.fn(),
        hoveredServer: null,
        setHoveredServer: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    }); it('renders databases section when databases data is provided', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('Databases')).toBeInTheDocument();
        // Use getAllByText since "Documents" appears in both databases and forests
        const documentsElements = screen.getAllByText('Documents');
        expect(documentsElements.length).toBeGreaterThanOrEqual(1);
        const securityElements = screen.getAllByText('Security');
        expect(securityElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders forests section when forests data is provided', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('Forests')).toBeInTheDocument();
        expect(screen.getAllByText('Documents')[0]).toBeInTheDocument(); // First Documents is from databases, second from forests
        expect(screen.getAllByText('Security')[0]).toBeInTheDocument();
    });

    it('renders servers section when servers data is provided', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('Servers')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('App-Services')).toBeInTheDocument();
    });

    it('renders raw JSON sections for all infrastructure data', () => {
        render(<InfrastructureTab {...defaultProps} />);

        expect(screen.getByText('View Raw Databases JSON')).toBeInTheDocument();
        expect(screen.getByText('View Raw Forests JSON')).toBeInTheDocument();
        expect(screen.getByText('View Raw Servers JSON')).toBeInTheDocument();
    });

    it('renders database details section when database details are provided', () => {
        const propsWithDatabaseDetails = {
            ...defaultProps,
            databaseDetails: {
                'Documents': { 'database-name': 'Documents', 'enabled': true }
            }
        };

        render(<InfrastructureTab {...propsWithDatabaseDetails} />);

        expect(screen.getByText('View Raw Database Details JSON')).toBeInTheDocument();
    });

    it('handles empty databases data gracefully', () => {
        const propsWithEmptyDatabases = {
            ...defaultProps,
            databases: null
        };

        render(<InfrastructureTab {...propsWithEmptyDatabases} />);

        // Should still render other sections without crashing
        expect(screen.getByText('Forests')).toBeInTheDocument();
        expect(screen.getByText('Servers')).toBeInTheDocument();
    });

    it('handles empty forests data gracefully', () => {
        const propsWithEmptyForests = {
            ...defaultProps,
            forests: null
        };

        render(<InfrastructureTab {...propsWithEmptyForests} />);

        // Should still render other sections without crashing
        expect(screen.getByText('Databases')).toBeInTheDocument();
        expect(screen.getByText('Servers')).toBeInTheDocument();
    });

    it('handles empty servers data gracefully', () => {
        const propsWithEmptyServers = {
            ...defaultProps,
            servers: null
        };

        render(<InfrastructureTab {...propsWithEmptyServers} />);

        // Should still render other sections without crashing
        expect(screen.getByText('Databases')).toBeInTheDocument();
        expect(screen.getByText('Forests')).toBeInTheDocument();
    });
});
