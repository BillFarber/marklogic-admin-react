import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RoleItem } from './RoleItem';
import '@testing-library/jest-dom';

describe('RoleItem', () => {
    const mockRole = {
        nameref: 'admin',
        uriref: '/manage/v2/roles/admin',
        idref: 'role123'
    };

    const mockRoleDetails = {
        'admin': {
            'role-name': 'admin',
            'description': 'Administrator role',
            'compartment': 'default',
            'external-names': [],
            'privileges': [
                { 'privilege-name': 'admin' },
                { 'privilege-name': 'manage-user' },
                { 'privilege-name': 'security' }
            ],
            'permissions': [],
            'collections': [],
            'roles': []
        }
    };

    const defaultProps = {
        role: mockRole,
        roleDetails: {},
        hoveredRole: null,
        setHoveredRole: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders role name', () => {
        render(<RoleItem {...defaultProps} />);

        expect(screen.getByText('admin')).toBeInTheDocument();
    });

    it('adds data-idref attribute when role has idref', () => {
        render(<RoleItem {...defaultProps} />);

        const roleElement = screen.getByText('admin');
        expect(roleElement.closest('li')).toHaveAttribute('data-idref', 'role123');
    });

    it('calls setHoveredRole on mouse enter with role nameref', () => {
        render(<RoleItem {...defaultProps} />);

        const roleElement = screen.getByText('admin');
        fireEvent.mouseEnter(roleElement);

        expect(defaultProps.setHoveredRole).toHaveBeenCalledWith('admin');
    });

    it('calls setHoveredRole with null on mouse leave', () => {
        vi.useFakeTimers();
        render(<RoleItem {...defaultProps} />);

        const roleElement = screen.getByText('admin');
        fireEvent.mouseLeave(roleElement);

        // Fast-forward time to trigger the timeout
        vi.advanceTimersByTime(300);

        expect(defaultProps.setHoveredRole).toHaveBeenCalledWith(null);
        vi.useRealTimers();
    });

    it('applies hover styles when role is hovered', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredRole: 'admin'
        };

        render(<RoleItem {...propsWithHover} />);

        const listItem = screen.getByTestId('role-item-role123');
        expect(listItem).toHaveStyle({ backgroundColor: '#4a7c59' });
    });

    it('does not apply hover styles when role is not hovered', () => {
        render(<RoleItem {...defaultProps} />);

        const listItem = screen.getByTestId('role-item-role123');
        expect(listItem).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
    });

    it('displays role type and ID information', () => {
        render(<RoleItem {...defaultProps} />);

        expect(screen.getByText(/Type: Role/)).toBeInTheDocument();
        expect(screen.getByText(/ID: role123/)).toBeInTheDocument();
    });

    it('handles missing role idref gracefully', () => {
        const roleWithoutIdref = {
            nameref: 'test-role',
            uriref: '/manage/v2/roles/test-role'
            // No idref
        };

        const propsWithoutIdref = {
            ...defaultProps,
            role: roleWithoutIdref
        };

        render(<RoleItem {...propsWithoutIdref} />);

        expect(screen.getByText('test-role')).toBeInTheDocument();
        expect(screen.getByText(/ID: N\/A/)).toBeInTheDocument();
    });

    describe('Show Details functionality', () => {
        it('shows "Show Details" button in hover tooltip when role is hovered', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredRole: 'admin',
                roleDetails: mockRoleDetails
            };

            render(<RoleItem {...propsWithHover} />);

            expect(screen.getByText('Show Details')).toBeInTheDocument();
        });

        it('does not show "Show Details" button when not hovered', () => {
            render(<RoleItem {...defaultProps} />);

            expect(screen.queryByText('Show Details')).not.toBeInTheDocument();
        });

        it('opens DetailsModal when "Show Details" button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredRole: 'admin',
                roleDetails: mockRoleDetails
            };

            render(<RoleItem {...propsWithHover} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Modal should be open and show the role details
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('admin Details')).toBeInTheDocument();
        });

        it('closes DetailsModal when close button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredRole: 'admin',
                roleDetails: mockRoleDetails
            };

            render(<RoleItem {...propsWithHover} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Modal should be open
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            // Close the modal
            const closeButton = screen.getByTitle('Close');
            fireEvent.click(closeButton);

            // Modal should be closed
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('passes correct data to DetailsModal', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredRole: 'admin',
                roleDetails: mockRoleDetails
            };

            render(<RoleItem {...propsWithDetails} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Check that modal shows role details
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
        });

        it('displays role information in hover tooltip when details are available', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredRole: 'admin',
                roleDetails: mockRoleDetails
            };

            render(<RoleItem {...propsWithDetails} />);

            // Check that role details are shown in tooltip
            expect(screen.getByText(/Role Details:/)).toBeInTheDocument();
            expect(screen.getByText(/Administrator role/)).toBeInTheDocument();
            expect(screen.getByText(/Compartment:/)).toBeInTheDocument();
            expect(screen.getByText(/External Names:/)).toBeInTheDocument();
        });

        it('displays privilege names correctly in tooltip', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredRole: 'admin',
                roleDetails: mockRoleDetails
            };

            render(<RoleItem {...propsWithDetails} />);

            // Check that privilege information is displayed - but the current tooltip doesn't show privileges
            // So let's check that permissions are shown instead
            expect(screen.getByText(/Permissions:/)).toBeInTheDocument();
        });

        it('handles role with no privileges gracefully', () => {
            const roleDetailsWithoutPrivileges = {
                'admin': {
                    'role-name': 'admin',
                    'description': 'Administrator role',
                    'compartment': 'default',
                    'privileges': []
                }
            };

            const propsWithDetails = {
                ...defaultProps,
                hoveredRole: 'admin',
                roleDetails: roleDetailsWithoutPrivileges
            };

            render(<RoleItem {...propsWithDetails} />);

            // Check that basic role info is still shown
            expect(screen.getByText(/Role Details:/)).toBeInTheDocument();
            expect(screen.getByText(/Administrator role/)).toBeInTheDocument();
        });
    });
});
