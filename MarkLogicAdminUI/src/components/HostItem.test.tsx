import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HostItem } from './HostItem';
import '@testing-library/jest-dom';

describe('HostItem', () => {
    const mockHost = {
        nameref: 'localhost',
        idref: 'host123',
        groupnameref: 'Default'
    };

    const mockHostDetails = {
        'host123': {
            'host-name': 'localhost',
            'bind-port': 7999,
            'foreign-bind-port': 7998,
            'bootstrap-host': true,
            'host-mode': 'normal',
            zone: ''
        }
    };

    const defaultProps = {
        host: mockHost,
        hostDetails: {},
        hoveredHost: null,
        setHoveredHost: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders host name', () => {
        render(<HostItem {...defaultProps} />);

        expect(screen.getByText('localhost')).toBeInTheDocument();
    });

    it('calls setHoveredHost on mouse enter with host idref', () => {
        render(<HostItem {...defaultProps} />);

        const hostElement = screen.getByText('localhost');
        fireEvent.mouseEnter(hostElement);

        expect(defaultProps.setHoveredHost).toHaveBeenCalledWith('host123');
    });

    it('applies hover styles when host is hovered', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredHost: 'host123'
        };

        render(<HostItem {...propsWithHover} />);

        const listItem = screen.getByRole('listitem');
        expect(listItem).toHaveStyle('background-color: #5a6c7d');
    });

    it('displays host ID and group information', () => {
        render(<HostItem {...defaultProps} />);

        expect(screen.getByText(/ID: host123/)).toBeInTheDocument();
        expect(screen.getByText(/Group: Default/)).toBeInTheDocument();
    });

    it('shows detailed host information on hover', () => {
        const propsWithDetails = {
            ...defaultProps,
            hostDetails: mockHostDetails,
            hoveredHost: 'host123'
        };

        render(<HostItem {...propsWithDetails} />);

        expect(screen.getByText('Host: localhost')).toBeInTheDocument();
        expect(screen.getByText('7999')).toBeInTheDocument();
        expect(screen.getByText('7998')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('normal')).toBeInTheDocument();
    });

    it('shows "View Full Details" button on hover', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredHost: 'host123'
        };

        render(<HostItem {...propsWithHover} />);

        expect(screen.getByText('View Full Details')).toBeInTheDocument();
    });

    it('handles missing host details gracefully', () => {
        const propsWithHover = {
            ...defaultProps,
            hoveredHost: 'host123'
        };

        render(<HostItem {...propsWithHover} />);

        // Should still show basic info even without details
        expect(screen.getByText('Host: localhost')).toBeInTheDocument();
        expect(screen.getByText('host123')).toBeInTheDocument();
    });

    it('displays only host name when not hovered', () => {
        render(<HostItem {...defaultProps} />);

        expect(screen.getByText('localhost')).toBeInTheDocument();
        expect(screen.queryByText('View Full Details')).not.toBeInTheDocument();
    });

    it('calls setHoveredHost with null on mouse leave after timeout', () => {
        vi.useFakeTimers();
        render(<HostItem {...defaultProps} />);

        const hostElement = screen.getByText('localhost');
        fireEvent.mouseEnter(hostElement);
        fireEvent.mouseLeave(hostElement);

        // Fast-forward time to trigger the timeout
        vi.advanceTimersByTime(300);

        expect(defaultProps.setHoveredHost).toHaveBeenCalledWith(null);
        vi.useRealTimers();
    });
});
