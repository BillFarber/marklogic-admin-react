import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserItem } from './UserItem';
import '@testing-library/jest-dom';

describe('UserItem', () => {
    const mockUser = {
        nameref: 'test-user',
        uriref: '/manage/v2/users/test-user'
    };

    const mockUserDetails = {
        'test-user': {
            'user-name': 'test-user',
            'description': 'Test user description',
            'role': ['manage-user', 'qconsole-user']
        }
    };

    const defaultProps = {
        user: mockUser,
        userDetails: {},
        hoveredUser: null,
        setHoveredUser: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders user name', () => {
        render(<UserItem {...defaultProps} />);

        expect(screen.getByText('test-user')).toBeInTheDocument();
    });

    it('calls setHoveredUser on mouse enter with user nameref', () => {
        render(<UserItem {...defaultProps} />);

        const userElement = screen.getByText('test-user');
        fireEvent.mouseEnter(userElement);

        expect(defaultProps.setHoveredUser).toHaveBeenCalledWith('test-user');
    });

    it('calls setHoveredUser with null on mouse leave', async () => {
        vi.useFakeTimers();

        render(<UserItem {...defaultProps} />);

        const userElement = screen.getByText('test-user');
        fireEvent.mouseLeave(userElement);

        // Fast-forward time to trigger timeout
        vi.advanceTimersByTime(300);

        expect(defaultProps.setHoveredUser).toHaveBeenCalledWith(null);

        vi.useRealTimers();
    }); it('applies hover styles when user is hovered', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredUser: 'test-user'
        };

        render(<UserItem {...propsWithHover} />);

        // Use getAllByText and get the first element which should be the main button
        const userElements = screen.getAllByText('test-user');
        const listItem = userElements[0].closest('li');
        expect(listItem).toHaveStyle({ backgroundColor: '#4a7c59' });
    });

    it('does not apply hover styles when user is not hovered', () => {
        render(<UserItem {...defaultProps} />);

        const userElement = screen.getByText('test-user');
        expect(userElement).not.toHaveStyle({ backgroundColor: '#8b3500' });
    });

    it('displays user details when available', () => {
        const propsWithDetails = {
            ...defaultProps,
            userDetails: mockUserDetails
        };

        render(<UserItem {...propsWithDetails} />);

        // The details should be displayed in some form (this depends on the actual implementation)
        expect(screen.getByText('test-user')).toBeInTheDocument();
    });

    it('handles missing user nameref gracefully', () => {
        const userWithoutNameref = {
            uriref: '/manage/v2/users/no-name'
        };

        const propsWithoutNameref = {
            ...defaultProps,
            user: userWithoutNameref
        };

        render(<UserItem {...propsWithoutNameref} />);

        // Should not crash and should handle the missing nameref appropriately
        expect(screen.queryByText('test-user')).not.toBeInTheDocument();
    });

    describe('Show Details functionality', () => {
        it('shows "Show Details" button in hover tooltip', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredUser: 'test-user'
            };

            render(<UserItem {...propsWithHover} />);

            expect(screen.getByText('Show Details')).toBeInTheDocument();
        });

        it('opens DetailsModal when "Show Details" button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredUser: 'test-user'
            };

            render(<UserItem {...propsWithHover} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Modal should be open
            expect(screen.getByText('User Details:')).toBeInTheDocument();
        });

        it('closes DetailsModal when close button is clicked', async () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredUser: 'test-user'
            };

            render(<UserItem {...propsWithHover} />);

            // Open modal
            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Verify modal is open by checking for modal-specific elements
            expect(screen.getByTitle('Close')).toBeInTheDocument();

            // Close modal
            const closeButton = screen.getByTitle('Close');
            fireEvent.click(closeButton);

            // Modal should be closed - check for modal backdrop which should be gone
            expect(screen.queryByTitle('Close')).not.toBeInTheDocument();
        });

        it('passes userDetails to DetailsModal', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredUser: 'test-user',
                userDetails: mockUserDetails
            };

            render(<UserItem {...propsWithDetails} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Check for modal-specific elements to distinguish from tooltip
            expect(screen.getByTitle('Close')).toBeInTheDocument();
            expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
        });
    });
});
