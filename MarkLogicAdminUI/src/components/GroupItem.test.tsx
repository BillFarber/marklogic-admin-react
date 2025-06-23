import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GroupItem } from './GroupItem';
import '@testing-library/jest-dom';

describe('GroupItem', () => {
    const mockGroup = {
        nameref: 'Default',
        uriref: '/manage/v2/groups/Default',
        idref: 'group123'
    };

    const mockGroupDetails = {
        'Default': {
            'group-properties': {
                'group-name': 'Default',
                'group-id': 'group123',
                'modules-root': '/',
                'root': '/',
                'http-user-agent': 'MarkLogic',
                'smtp-relay': 'localhost',
                'smtp-timeout': 30,
                'xdqp-timeout': 30,
                'host-timeout': 30,
                'retry-timeout': 5,
                'module-cache-timeout': 300,
                'list-cache-size': 256,
                'list-cache-partitions': 4,
                'tree-cache-size': 256,
                'tree-cache-partitions': 4,
                'compressed-tree-cache-size': 512,
                'compressed-tree-cache-partitions': 4,
                'expanded-tree-cache-size': 512,
                'expanded-tree-cache-partitions': 4,
                'triple-cache-size': 256,
                'triple-cache-partitions': 4,
                'triple-value-cache-size': 256,
                'triple-value-cache-partitions': 4,
                'background-io-limit': 100,
                'metering-enabled': false,
                'performance-metering-enabled': false,
                'performance-metering-period': 60,
                'performance-metering-retain-raw': 168,
                'performance-metering-retain-hourly': 720,
                'performance-metering-retain-daily': 366
            }
        }
    };

    const defaultProps = {
        group: mockGroup,
        groupDetails: {},
        hoveredGroup: null,
        setHoveredGroup: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders group name', () => {
        render(<GroupItem {...defaultProps} />);

        expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('adds data-idref attribute when group has idref', () => {
        render(<GroupItem {...defaultProps} />);

        const groupElement = screen.getByText('Default');
        expect(groupElement.closest('li')).toHaveAttribute('data-idref', 'group123');
    });

    it('calls setHoveredGroup on mouse enter with group idref', () => {
        render(<GroupItem {...defaultProps} />);

        const groupElement = screen.getByText('Default');
        fireEvent.mouseEnter(groupElement);

        expect(defaultProps.setHoveredGroup).toHaveBeenCalledWith('group123');
    });

    it('calls setHoveredGroup with null on mouse leave', () => {
        vi.useFakeTimers();
        render(<GroupItem {...defaultProps} />);

        const groupElement = screen.getByText('Default');
        fireEvent.mouseLeave(groupElement);

        // Fast-forward time to trigger the timeout
        vi.advanceTimersByTime(300);

        expect(defaultProps.setHoveredGroup).toHaveBeenCalledWith(null);
        vi.useRealTimers();
    });

    it('applies hover styles when group is hovered', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredGroup: 'group123'
        };

        render(<GroupItem {...propsWithHover} />);

        const listItem = screen.getByText('Default').closest('li');
        expect(listItem).toHaveStyle({ backgroundColor: '#5a6c7d' });
    });

    it('does not apply hover styles when group is not hovered', () => {
        render(<GroupItem {...defaultProps} />);

        const listItem = screen.getByText('Default').closest('li');
        expect(listItem).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
    });

    it('displays group ID information', () => {
        render(<GroupItem {...defaultProps} />);

        expect(screen.getByText(/ID: group123/)).toBeInTheDocument();
    });

    it('handles missing group idref gracefully', () => {
        const groupWithoutIdref = {
            nameref: 'Test-Group',
            uriref: '/manage/v2/groups/Test-Group'
            // No idref
        };

        const propsWithoutIdref = {
            ...defaultProps,
            group: groupWithoutIdref
        };

        render(<GroupItem {...propsWithoutIdref} />);

        expect(screen.getByText('Test-Group')).toBeInTheDocument();
        expect(screen.getByText(/ID: N\/A/)).toBeInTheDocument();
    });

    describe('Show Details functionality', () => {
        it('shows "Show Details" button in hover tooltip when group is hovered', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithHover} />);

            expect(screen.getByText('Show Details')).toBeInTheDocument();
        });

        it('does not show "Show Details" button when not hovered', () => {
            render(<GroupItem {...defaultProps} />);

            expect(screen.queryByText('Show Details')).not.toBeInTheDocument();
        });

        it('opens DetailsModal when "Show Details" button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithHover} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Modal should be open and show the group details
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Default Details')).toBeInTheDocument();
        });

        it('closes DetailsModal when close button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithHover} />);

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
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithDetails} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            // Check that modal shows group details
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
        });

        it('displays group information in hover tooltip when details are available', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithDetails} />);

            // Check that group details are shown in tooltip
            expect(screen.getByText(/Modules Root:/)).toBeInTheDocument();
            expect(screen.getAllByText(/Root:/).length).toBeGreaterThan(0); // Both "Modules Root:" and "Root:" exist
            expect(screen.getByText(/HTTP User Agent:/)).toBeInTheDocument();
        });

        it('displays cache configuration in tooltip', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithDetails} />);

            // Check that cache configuration is displayed
            expect(screen.getByText(/List Cache Size:/)).toBeInTheDocument();
            expect(screen.getByText(/Tree Cache Size:/)).toBeInTheDocument();
            expect(screen.getByText(/Triple Cache Size:/)).toBeInTheDocument();
        });

        it('displays timeout configuration in tooltip', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithDetails} />);

            // Check that timeout configuration is displayed
            expect(screen.getByText(/SMTP Timeout:/)).toBeInTheDocument();
            expect(screen.getByText(/XDQP Timeout:/)).toBeInTheDocument();
            expect(screen.getByText(/Host Timeout:/)).toBeInTheDocument();
        });

        it('displays performance metering information in tooltip', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredGroup: 'group123',
                groupDetails: mockGroupDetails
            };

            render(<GroupItem {...propsWithDetails} />);

            // Check that performance metering information is displayed
            expect(screen.getByText(/Metering Enabled:/)).toBeInTheDocument();
            expect(screen.getByText(/Performance Metering:/)).toBeInTheDocument();
        });
    });
});
