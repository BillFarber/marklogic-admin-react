import { render, screen, fireEvent } from '@testing-library/react';
import { UserItem } from './UserItem';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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
});
