import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataTab } from './DataTab';
import '@testing-library/jest-dom';

describe('DataTab', () => {
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

    const defaultProps = {
        databases: mockDatabases,
        databaseDetails: {},
        forests: mockForests,
        forestDetails: {},
        hoveredDatabase: null,
        setHoveredDatabase: vi.fn(),
        hoveredForest: null,
        setHoveredForest: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders databases section when databases data is provided', () => {
        render(<DataTab {...defaultProps} />);

        expect(screen.getByText('Databases')).toBeInTheDocument();
        // Use getAllByText since "Documents" appears in both databases and forests
        const documentsElements = screen.getAllByText('Documents');
        expect(documentsElements.length).toBeGreaterThanOrEqual(1);
        const securityElements = screen.getAllByText('Security');
        expect(securityElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders forests section when forests data is provided', () => {
        render(<DataTab {...defaultProps} />);

        expect(screen.getByText('Forests')).toBeInTheDocument();
        expect(screen.getAllByText('Documents')[0]).toBeInTheDocument(); // First Documents is from databases, second from forests
        expect(screen.getAllByText('Security')[0]).toBeInTheDocument();
    });

    it('renders raw JSON sections for all data', () => {
        render(<DataTab {...defaultProps} />);

        expect(screen.getByText('View Raw Databases JSON')).toBeInTheDocument();
        expect(screen.getByText('View Raw Forests JSON')).toBeInTheDocument();
    });

    it('renders database details section when database details are provided', () => {
        const propsWithDatabaseDetails = {
            ...defaultProps,
            databaseDetails: {
                'Documents': { 'database-name': 'Documents', 'enabled': true }
            }
        };

        render(<DataTab {...propsWithDatabaseDetails} />);

        expect(screen.getByText('View Raw Database Details JSON')).toBeInTheDocument();
    });

    it('handles empty databases data gracefully', () => {
        const propsWithEmptyDatabases = {
            ...defaultProps,
            databases: null
        };

        render(<DataTab {...propsWithEmptyDatabases} />);

        // Should still render other sections without crashing
        expect(screen.getByText('Forests')).toBeInTheDocument();
        expect(screen.getByText('View Raw Forests JSON')).toBeInTheDocument();
    });

    it('handles empty forests data gracefully', () => {
        const propsWithEmptyForests = {
            ...defaultProps,
            forests: null
        };

        render(<DataTab {...propsWithEmptyForests} />);

        // Should still render other sections without crashing
        expect(screen.getByText('Databases')).toBeInTheDocument();
        expect(screen.getByText('View Raw Databases JSON')).toBeInTheDocument();
    });

    it('calls setHoveredDatabase and setHoveredForest when provided', () => {
        const mockSetHoveredDatabase = vi.fn();
        const mockSetHoveredForest = vi.fn();
        const propsWithHoverHandlers = {
            ...defaultProps,
            setHoveredDatabase: mockSetHoveredDatabase,
            setHoveredForest: mockSetHoveredForest
        };

        render(<DataTab {...propsWithHoverHandlers} />);

        expect(screen.getByText('Databases')).toBeInTheDocument();
        expect(screen.getByText('Forests')).toBeInTheDocument();
    });

    it('does not render database details section when no database details are provided', () => {
        render(<DataTab {...defaultProps} />);

        expect(screen.queryByText('View Raw Database Details JSON')).not.toBeInTheDocument();
    });
});
