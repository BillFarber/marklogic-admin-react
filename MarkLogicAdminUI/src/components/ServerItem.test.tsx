import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServerItem } from './ServerItem';
import '@testing-library/jest-dom';

describe('ServerItem', () => {
    const mockServer = {
        nameref: 'Admin',
        idref: 'server123',
        kindref: 'http',
        groupnameref: 'Default'
    };

    const mockServerDetails = {
        'Admin': {
            enabled: true,
            port: 8001,
            'server-type': 'http'
        }
    };

    const defaultProps = {
        server: mockServer,
        serverDetails: {},
        hoveredServer: null,
        setHoveredServer: vi.fn(),
        onDatabaseClick: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders server name', () => {
        render(<ServerItem {...defaultProps} />);

        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('calls setHoveredServer on mouse enter with server idref', () => {
        render(<ServerItem {...defaultProps} />);

        const serverElement = screen.getByText('Admin');
        fireEvent.mouseEnter(serverElement);

        expect(defaultProps.setHoveredServer).toHaveBeenCalledWith('server123');
    });

    it('applies hover styles when server is hovered', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredServer: 'server123'
        };

        render(<ServerItem {...propsWithHover} />);

        // Get the first instance of "Admin" which should be the main server name
        const adminElements = screen.getAllByText('Admin');
        const listItem = adminElements[0].closest('li');
        expect(listItem).toHaveStyle({ backgroundColor: '#5a6c7d' });
    });

    describe('Show Details functionality', () => {
        it('shows "Show Details" button in hover tooltip', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredServer: 'server123'
            };

            render(<ServerItem {...propsWithHover} />);

            expect(screen.getByText('Show Details')).toBeInTheDocument();
        });

        it('opens DetailsModal when "Show Details" button is clicked', () => {
            const propsWithHover = {
                ...defaultProps,
                hoveredServer: 'server123'
            };

            render(<ServerItem {...propsWithHover} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            expect(screen.getByText('Server Details:')).toBeInTheDocument();
        });

        it('passes combined server data to DetailsModal', () => {
            const propsWithDetails = {
                ...defaultProps,
                hoveredServer: 'server123',
                serverDetails: mockServerDetails
            };

            render(<ServerItem {...propsWithDetails} />);

            const showDetailsButton = screen.getByText('Show Details');
            fireEvent.click(showDetailsButton);

            expect(screen.getByText('Server Details:')).toBeInTheDocument();
            expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
        });
    });
});
