import { render, screen, waitFor } from '@testing-library/react';
import { SecurityTab } from './SecurityTab';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('SecurityTab', () => {
    const mockUsers = {
        'user-default-list': {
            'list-items': {
                'list-item': [
                    { nameref: 'admin', uriref: '/manage/v2/users/admin' },
                    { nameref: 'test-user', uriref: '/manage/v2/users/test-user' }
                ]
            }
        }
    };

    const mockRoles = {
        'role-default-list': {
            'list-items': {
                'list-item': [
                    { nameref: 'admin', uriref: '/manage/v2/roles/admin' },
                    { nameref: 'manage-user', uriref: '/manage/v2/roles/manage-user' }
                ]
            }
        }
    };

    const defaultProps = {
        users: mockUsers,
        roles: mockRoles,
        userDetails: {},
        roleDetails: {},
        hoveredUser: null,
        setHoveredUser: vi.fn(),
        hoveredRole: null,
        setHoveredRole: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    }); it('renders users section when users data is provided', () => {
        render(<SecurityTab {...defaultProps} />);

        expect(screen.getByText('Users')).toBeInTheDocument();
        // Use getAllByText since "admin" appears in both users and roles
        const adminElements = screen.getAllByText('admin');
        expect(adminElements.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('test-user')).toBeInTheDocument();
    }); it('renders roles section when roles data is provided', () => {
        render(<SecurityTab {...defaultProps} />);

        expect(screen.getByText('Roles')).toBeInTheDocument();
        // Use getAllByText since "admin" appears in both users and roles
        const adminElements = screen.getAllByText('admin');
        expect(adminElements.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('manage-user')).toBeInTheDocument();
    });

    it('renders raw JSON sections for users and roles', () => {
        render(<SecurityTab {...defaultProps} />);

        expect(screen.getByText('View Raw Users JSON')).toBeInTheDocument();
        expect(screen.getByText('View Raw Roles JSON')).toBeInTheDocument();
    });

    it('renders user details section when userDetails are provided', () => {
        const propsWithUserDetails = {
            ...defaultProps,
            userDetails: {
                'admin': { 'user-name': 'admin', 'description': 'Administrator user' }
            }
        };

        render(<SecurityTab {...propsWithUserDetails} />);

        expect(screen.getByText('View Raw User Details JSON')).toBeInTheDocument();
    });

    it('renders role details section when roleDetails are provided', () => {
        const propsWithRoleDetails = {
            ...defaultProps,
            roleDetails: {
                'admin': { 'role-name': 'admin', 'description': 'Administrator role' }
            }
        };

        render(<SecurityTab {...propsWithRoleDetails} />);

        expect(screen.getByText('View Raw Role Details JSON')).toBeInTheDocument();
    });

    it('handles empty users data gracefully', () => {
        const propsWithEmptyUsers = {
            ...defaultProps,
            users: null
        };

        render(<SecurityTab {...propsWithEmptyUsers} />);

        // Should still render the component without crashing
        expect(screen.getByText('Roles')).toBeInTheDocument();
    });

    it('handles empty roles data gracefully', () => {
        const propsWithEmptyRoles = {
            ...defaultProps,
            roles: null
        };

        render(<SecurityTab {...propsWithEmptyRoles} />);

        // Should still render the component without crashing
        expect(screen.getByText('Users')).toBeInTheDocument();
    });
});
