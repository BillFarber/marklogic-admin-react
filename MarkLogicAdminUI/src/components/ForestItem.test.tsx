import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ForestItem } from './ForestItem';
import '@testing-library/jest-dom';

describe('ForestItem', () => {
  const mockForest = {
    nameref: 'Documents',
    uriref: '/manage/v2/forests/Documents',
    idref: 'forest123',
  };

  const mockForestDetails = {
    forest123: {
      'forest-properties': {
        'forest-name': 'Documents',
        host: 'localhost',
        enabled: true,
        'data-directory': '/var/opt/MarkLogic/Forests/Documents',
        'large-data-directory': '/var/opt/MarkLogic/Forests/Documents/Large',
        'fast-data-directory': '/var/opt/MarkLogic/Forests/Documents/Fast',
      },
    },
  };

  const defaultProps = {
    forest: mockForest,
    forestDetails: {},
    hoveredForest: null,
    setHoveredForest: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders forest name', () => {
    render(<ForestItem {...defaultProps} />);

    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  it('adds data-idref attribute when forest has idref', () => {
    render(<ForestItem {...defaultProps} />);

    const forestElement = screen.getByText('Documents');
    expect(forestElement.closest('li')).toHaveAttribute(
      'data-idref',
      'forest123',
    );
  });

  it('calls setHoveredForest on mouse enter with forest idref', () => {
    render(<ForestItem {...defaultProps} />);

    const forestElement = screen.getByText('Documents');
    fireEvent.mouseEnter(forestElement);

    expect(defaultProps.setHoveredForest).toHaveBeenCalledWith('forest123');
  });

  it('calls setHoveredForest with null on mouse leave', () => {
    vi.useFakeTimers();
    render(<ForestItem {...defaultProps} />);

    const forestElement = screen.getByText('Documents');
    fireEvent.mouseLeave(forestElement);

    // Fast-forward time to trigger the timeout
    vi.advanceTimersByTime(300);

    expect(defaultProps.setHoveredForest).toHaveBeenCalledWith(null);
    vi.useRealTimers();
  });

  it('applies hover styles when forest is hovered', () => {
    const propsWithHover = {
      ...defaultProps,
      hoveredForest: 'forest123',
    };

    render(<ForestItem {...propsWithHover} />);

    const listItem = screen.getAllByText('Documents')[0].closest('li');
    expect(listItem).toHaveStyle({ backgroundColor: '#a0303e' });
  });

  it('does not apply hover styles when forest is not hovered', () => {
    render(<ForestItem {...defaultProps} />);

    const listItem = screen.getByText('Documents').closest('li');
    expect(listItem).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
  });

  it('displays forest type and ID information', () => {
    render(<ForestItem {...defaultProps} />);

    expect(screen.getByText(/Type: Forest/)).toBeInTheDocument();
    expect(screen.getByText(/ID: forest123/)).toBeInTheDocument();
  });

  it('handles missing forest idref gracefully', () => {
    const forestWithoutIdref = {
      nameref: 'Test-Forest',
      uriref: '/manage/v2/forests/Test-Forest',
      // No idref
    };

    const propsWithoutIdref = {
      ...defaultProps,
      forest: forestWithoutIdref,
    };

    render(<ForestItem {...propsWithoutIdref} />);

    expect(screen.getByText('Test-Forest')).toBeInTheDocument();
    expect(screen.getByText(/ID: N\/A/)).toBeInTheDocument();
  });

  describe('Show Details functionality', () => {
    it('shows "Show Details" button in hover tooltip when forest is hovered', () => {
      const propsWithHover = {
        ...defaultProps,
        hoveredForest: 'forest123',
        forestDetails: mockForestDetails,
      };

      render(<ForestItem {...propsWithHover} />);

      expect(screen.getByText('Show Details')).toBeInTheDocument();
    });

    it('does not show "Show Details" button when not hovered', () => {
      render(<ForestItem {...defaultProps} />);

      expect(screen.queryByText('Show Details')).not.toBeInTheDocument();
    });

    it('opens DetailsModal when "Show Details" button is clicked', () => {
      const propsWithHover = {
        ...defaultProps,
        hoveredForest: 'forest123',
        forestDetails: mockForestDetails,
      };

      render(<ForestItem {...propsWithHover} />);

      const showDetailsButton = screen.getByText('Show Details');
      fireEvent.click(showDetailsButton);

      // Modal should be open and show the forest details
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Documents Details')).toBeInTheDocument();
    });

    it('closes DetailsModal when close button is clicked', () => {
      const propsWithHover = {
        ...defaultProps,
        hoveredForest: 'forest123',
        forestDetails: mockForestDetails,
      };

      render(<ForestItem {...propsWithHover} />);

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
        hoveredForest: 'forest123',
        forestDetails: mockForestDetails,
      };

      render(<ForestItem {...propsWithDetails} />);

      const showDetailsButton = screen.getByText('Show Details');
      fireEvent.click(showDetailsButton);

      // Check that modal shows forest details
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
    });

    it('displays forest properties in hover tooltip when details are available', () => {
      const propsWithDetails = {
        ...defaultProps,
        hoveredForest: 'forest123',
        forestDetails: mockForestDetails,
      };

      render(<ForestItem {...propsWithDetails} />);

      // Check that forest details are shown in tooltip
      expect(screen.getByText(/Host:/)).toBeInTheDocument();
      expect(screen.getByText(/localhost/)).toBeInTheDocument();
      expect(screen.getByText(/Enabled:/)).toBeInTheDocument();
      expect(screen.getAllByText(/Data Directory:/)[0]).toBeInTheDocument();
    });
  });
});
