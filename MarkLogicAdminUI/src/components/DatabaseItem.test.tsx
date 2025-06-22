import { render, screen, fireEvent } from '@testing-library/react';
import { DatabaseItem } from './DatabaseItem';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('DatabaseItem', () => {
    const mockDatabase = {
        nameref: 'Documents',
        uriref: '/manage/v2/databases/Documents',
        idref: 'db123'
    };

    const mockDatabaseDetails = {
        'Documents': {
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
        };

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
        };

        const propsWithoutIdref = {
            ...defaultProps,
            database: databaseWithoutIdref
        };

        render(<DatabaseItem {...propsWithoutIdref} />);

        expect(screen.getByText('Test-Database')).toBeInTheDocument();
        const listItem = screen.getByText('Test-Database').closest('li');
        expect(listItem).not.toHaveAttribute('data-idref');
    });
});
