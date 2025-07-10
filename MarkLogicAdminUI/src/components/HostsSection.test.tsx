import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HostsSection } from './HostsSection';
import '@testing-library/jest-dom';

describe('HostsSection', () => {
  const mockHosts = {
    'host-default-list': {
      'list-items': {
        'list-item': [
          {
            nameref: 'localhost',
            idref: 'host123',
            groupnameref: 'Default',
          },
          {
            nameref: 'remote-host',
            idref: 'host456',
            groupnameref: 'Cluster',
          },
        ],
      },
    },
  };

  const mockHostDetails = {
    host123: {
      'host-name': 'localhost',
      'bind-port': 7999,
    },
    host456: {
      'host-name': 'remote-host',
      'bind-port': 8000,
    },
  };

  const defaultProps = {
    hosts: mockHosts,
    hostDetails: mockHostDetails,
    hoveredHost: null,
    setHoveredHost: vi.fn(),
  };

  it('renders hosts section with title', () => {
    render(<HostsSection {...defaultProps} />);

    expect(screen.getByText('Hosts')).toBeInTheDocument();
  });

  it('renders all hosts from the list', () => {
    render(<HostsSection {...defaultProps} />);

    expect(screen.getByText('localhost')).toBeInTheDocument();
    expect(screen.getByText('remote-host')).toBeInTheDocument();
  });

  it('renders nothing when hosts is null', () => {
    const propsWithNullHosts = {
      ...defaultProps,
      hosts: null,
    };

    const { container } = render(<HostsSection {...propsWithNullHosts} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when hosts has invalid structure', () => {
    const propsWithInvalidHosts = {
      ...defaultProps,
      hosts: {
        'invalid-structure': {},
      },
    };

    const { container } = render(<HostsSection {...propsWithInvalidHosts} />);
    expect(container.firstChild).toBeNull();
  });

  it('filters out hosts without nameref', () => {
    const hostsWithMissingNames = {
      'host-default-list': {
        'list-items': {
          'list-item': [
            {
              nameref: 'valid-host',
              idref: 'host123',
            },
            {
              idref: 'host456', // missing nameref
            },
          ],
        },
      },
    };

    const propsWithFilteredHosts = {
      ...defaultProps,
      hosts: hostsWithMissingNames,
    };

    render(<HostsSection {...propsWithFilteredHosts} />);

    expect(screen.getByText('valid-host')).toBeInTheDocument();
    expect(screen.queryByText('host456')).not.toBeInTheDocument();
  });

  it('applies correct styling to the hosts list', () => {
    render(<HostsSection {...defaultProps} />);

    const hostsList = screen.getByRole('list');
    expect(hostsList).toHaveStyle({
      background: '#34495e',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      listStyle: 'none',
    });
  });

  it('renders empty list when hosts array is empty', () => {
    const propsWithEmptyList = {
      ...defaultProps,
      hosts: {
        'host-default-list': {
          'list-items': {
            'list-item': [],
          },
        },
      },
    };

    render(<HostsSection {...propsWithEmptyList} />);

    expect(screen.getByText('Hosts')).toBeInTheDocument();
    const hostsList = screen.getByRole('list');
    expect(hostsList).toBeInTheDocument();
    expect(hostsList.children).toHaveLength(0);
  });
});
