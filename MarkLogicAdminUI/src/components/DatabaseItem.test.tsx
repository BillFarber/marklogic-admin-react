import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { MarkLogicListItem } from '../types/marklogic';
import { DatabaseItem } from './DatabaseItem';
import '@testing-library/jest-dom';

describe('DatabaseItem', () => {
    const mockDatabase = {
        nameref: 'Documents',
        uriref: '/manage/v2/databases/Documents',
        idref: 'db123'
    };

    const mockDatabaseDetails = {
        'db123': {
            'database-name': 'Documents',
            'enabled': true,
            'uri-lexicon': false
        }
    };

    const defaultProps = {
        database: mockDatabase,
        databaseDetails: {},
        hoveredDatabase: null,
        setHoveredDatabase: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders database name', () => {
        render(<DatabaseItem {...defaultProps} />);

        expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('adds data-idref attribute when database has idref', () => {
        render(<DatabaseItem {...defaultProps} />);

        const databaseElement = screen.getByText('Documents');
        expect(databaseElement.closest('li')).toHaveAttribute('data-idref', 'db123');
    }); it('calls setHoveredDatabase on mouse enter with database idref', () => {
        render(<DatabaseItem {...defaultProps} />);

        const databaseElement = screen.getByText('Documents');
        fireEvent.mouseEnter(databaseElement);

        expect(defaultProps.setHoveredDatabase).toHaveBeenCalledWith('db123');
    });

    it('calls setHoveredDatabase with null on mouse leave', async () => {
        vi.useFakeTimers();

        render(<DatabaseItem {...defaultProps} />);

        const databaseElement = screen.getByText('Documents');
        fireEvent.mouseLeave(databaseElement);

        // Fast-forward time to trigger timeout
        vi.advanceTimersByTime(300);

        expect(defaultProps.setHoveredDatabase).toHaveBeenCalledWith(null);

        vi.useRealTimers();
    }); it('applies hover styles when database is hovered', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredDatabase: 'db123' // Use idref instead of nameref
        };

        render(<DatabaseItem {...propsWithHover} />);

        const listItem = screen.getByText('Documents').closest('li');
        expect(listItem).toHaveStyle({ backgroundColor: '#a0303e' });
    });

    it('does not apply hover styles when database is not hovered', () => {
        render(<DatabaseItem {...defaultProps} />);

        const databaseElement = screen.getByText('Documents');
        expect(databaseElement).not.toHaveStyle({ backgroundColor: '#8b3500' });
    });

    it('displays database details when available', () => {
        const propsWithDetails = {
            ...defaultProps,
            databaseDetails: mockDatabaseDetails
        };

        render(<DatabaseItem {...propsWithDetails} />);

        expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('handles missing database nameref gracefully', () => {
        const databaseWithoutNameref = {
            uriref: '/manage/v2/databases/no-name',
            idref: 'db456'
        } as MarkLogicListItem; // Type assertion for testing edge case

        const propsWithoutNameref = {
            ...defaultProps,
            database: databaseWithoutNameref
        };

        render(<DatabaseItem {...propsWithoutNameref} />);

        // Should not crash and should handle the missing nameref appropriately
        expect(screen.queryByText('Documents')).not.toBeInTheDocument();
    });

    it('handles missing database idref gracefully', () => {
        const databaseWithoutIdref = {
            nameref: 'Test-Database',
            uriref: '/manage/v2/databases/Test-Database'
        } as MarkLogicListItem; // Type assertion for testing edge case

        const propsWithoutIdref = {
            ...defaultProps,
            database: databaseWithoutIdref
        };

        render(<DatabaseItem {...propsWithoutIdref} />);

        expect(screen.getByText('Test-Database')).toBeInTheDocument();
        const listItem = screen.getByText('Test-Database').closest('li');
        expect(listItem).not.toHaveAttribute('data-idref');
    });

    describe('Show Details functionality', () => {
        it('shows "Show Details" button in hover tooltip when database has details', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredDatabase: 'db123',
                databaseDetails: mockDatabaseDetails
            };

            render(<DatabaseItem {...propsWithHover} />);

            expect(screen.getByText('Show Details')).toBeInTheDocument();
        });

        it('does not show "Show Details" button when not hovered', () => {
            render(<DatabaseItem {...defaultProps} />);

            expect(screen.queryByText('Show Details')).not.toBeInTheDocument();
        });

        it('does not show "Show Details" button when hovered but no details', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredDatabase: 'db123'
                // No databaseDetails provided
            };

            render(<DatabaseItem {...propsWithHover} />);

            expect(screen.queryByText('Show Details')).not.toBeInTheDocument();
        });

        it('opens DetailsModal when "Show Details" button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredDatabase: 'db123',
                databaseDetails: mockDatabaseDetails
            };

            render(<DatabaseItem {...propsWithHover} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Modal should be open and show the database details
            expect(screen.getByText('Database Details:')).toBeInTheDocument();
        });

        it('closes DetailsModal when close button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredDatabase: 'db123',
                databaseDetails: mockDatabaseDetails
            };

            render(<DatabaseItem {...propsWithHover} />);

            // Open modal
            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Close modal
            const closeButton = screen.getByText('×');
            fireEvent.click(closeButton);

            // Modal should be closed
            expect(screen.queryByText('Database Details:')).not.toBeInTheDocument();
        });

        it('passes correct data to DetailsModal', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredDatabase: 'db123',
                databaseDetails: mockDatabaseDetails
            };

            render(<DatabaseItem {...propsWithDetails} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Check that modal shows database details
            expect(screen.getByText('Database Details:')).toBeInTheDocument();
            expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
        });
    });
});
