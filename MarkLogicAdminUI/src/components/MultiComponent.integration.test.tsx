import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseItem } from './DatabaseItem';
import { ServerItem } from './ServerItem';
import { UserItem } from './UserItem';
import { ForestItem } from './ForestItem';
import { RoleItem } from './RoleItem';
import { GroupItem } from './GroupItem';
import '@testing-library/jest-dom';

describe('Multi-Component DetailsModal Integration', () => {
  const mockSetHovered = vi.fn();

  const mockDatabase = {
    nameref: 'Documents',
    uriref: '/manage/v2/databases/Documents',
    idref: 'db123',
  };

  const mockServer = {
    nameref: 'Admin',
    uriref: '/manage/v2/servers/Admin',
    idref: 'server123',
    kindref: 'http',
    groupnameref: 'Default',
  };

  const mockUser = {
    nameref: 'admin',
    uriref: '/manage/v2/users/admin',
    idref: 'user123',
  };

  const mockForest = {
    nameref: 'Documents',
    uriref: '/manage/v2/forests/Documents',
    idref: 'forest123',
  };

  const mockRole = {
    nameref: 'admin',
    uriref: '/manage/v2/roles/admin',
    idref: 'role123',
  };

  const mockGroup = {
    nameref: 'Default',
    uriref: '/manage/v2/groups/Default',
    idref: 'group123',
  };

  const mockDatabaseDetails = {
    db123: {
      'database-name': 'Documents',
      enabled: true,
      'uri-lexicon': false,
    },
  };

  const mockServerDetails = {
    server123: {
      'server-name': 'Admin',
      'server-type': 'http',
      enabled: true,
      port: 8001,
    },
  };

  const mockUserDetails = {
    admin: {
      'user-name': 'admin',
      description: 'Administrator user',
    },
  };

  const mockForestDetails = {
    forest123: {
      'forest-properties': {
        'forest-name': 'Documents',
        enabled: true,
        host: 'localhost',
      },
    },
  };

  const mockRoleDetails = {
    admin: {
      'role-name': 'admin',
      description: 'Administrator role',
      privileges: [
        { 'privilege-name': 'admin' },
        { 'privilege-name': 'manage-user' },
      ],
    },
  };

  const mockGroupDetails = {
    Default: {
      'group-name': 'Default',
      'modules-root': '/',
      root: '/',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Consistent DetailsModal behavior across components', () => {
    it('all components render Show Details button when hovered with details', () => {
      const { rerender } = render(
        <DatabaseItem
          database={mockDatabase}
          databaseDetails={mockDatabaseDetails}
          hoveredDatabase="db123"
          setHoveredDatabase={mockSetHovered}
        />,
      );
      expect(screen.getByText('Show Details')).toBeInTheDocument();

      rerender(
        <ServerItem
          server={mockServer}
          serverDetails={mockServerDetails}
          hoveredServer="server123"
          setHoveredServer={mockSetHovered}
        />,
      );
      expect(screen.getByText('Show Details')).toBeInTheDocument();

      rerender(
        <UserItem
          user={mockUser}
          userDetails={mockUserDetails}
          hoveredUser="admin"
          setHoveredUser={mockSetHovered}
        />,
      );
      expect(screen.getByText('Show Details')).toBeInTheDocument();

      rerender(
        <ForestItem
          forest={mockForest}
          forestDetails={mockForestDetails}
          hoveredForest="forest123"
          setHoveredForest={mockSetHovered}
        />,
      );
      expect(screen.getByText('Show Details')).toBeInTheDocument();

      rerender(
        <RoleItem
          role={mockRole}
          roleDetails={mockRoleDetails}
          hoveredRole="admin"
          setHoveredRole={mockSetHovered}
        />,
      );
      expect(screen.getByText('Show Details')).toBeInTheDocument();

      rerender(
        <GroupItem
          group={mockGroup}
          groupDetails={mockGroupDetails}
          hoveredGroup="group123"
          setHoveredGroup={mockSetHovered}
        />,
      );
      expect(screen.getByText('Show Details')).toBeInTheDocument();
    });

    it('all components open DetailsModal with correct entity type header', () => {
      const { rerender } = render(
        <DatabaseItem
          database={mockDatabase}
          databaseDetails={mockDatabaseDetails}
          hoveredDatabase="db123"
          setHoveredDatabase={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Database Details:')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));

      rerender(
        <ServerItem
          server={mockServer}
          serverDetails={mockServerDetails}
          hoveredServer="server123"
          setHoveredServer={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Server Details:')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));

      rerender(
        <UserItem
          user={mockUser}
          userDetails={mockUserDetails}
          hoveredUser="admin"
          setHoveredUser={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText('User Details:')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));

      rerender(
        <ForestItem
          forest={mockForest}
          forestDetails={mockForestDetails}
          hoveredForest="forest123"
          setHoveredForest={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      const forestModal = screen.getByRole('dialog');
      expect(
        within(forestModal).getByText('Forest Details:'),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));

      rerender(
        <RoleItem
          role={mockRole}
          roleDetails={mockRoleDetails}
          hoveredRole="admin"
          setHoveredRole={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      const roleModal = screen.getByRole('dialog');
      expect(within(roleModal).getByText('Role Details:')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));

      rerender(
        <GroupItem
          group={mockGroup}
          groupDetails={mockGroupDetails}
          hoveredGroup="group123"
          setHoveredGroup={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Group Details:')).toBeInTheDocument();
    });

    it('all components include Complete JSON Data section in modal', () => {
      // Test DatabaseItem
      const { unmount: unmountDb } = render(
        <DatabaseItem
          database={mockDatabase}
          databaseDetails={mockDatabaseDetails}
          hoveredDatabase="db123"
          setHoveredDatabase={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      unmountDb();

      // Test ServerItem
      const { unmount: unmountServer } = render(
        <ServerItem
          server={mockServer}
          serverDetails={mockServerDetails}
          hoveredServer="server123"
          setHoveredServer={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      unmountServer();

      // Test UserItem
      const { unmount: unmountUser } = render(
        <UserItem
          user={mockUser}
          userDetails={mockUserDetails}
          hoveredUser="admin"
          setHoveredUser={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      unmountUser();

      // Test ForestItem
      const { unmount: unmountForest } = render(
        <ForestItem
          forest={mockForest}
          forestDetails={mockForestDetails}
          hoveredForest="forest123"
          setHoveredForest={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      unmountForest();

      // Test RoleItem
      const { unmount: unmountRole } = render(
        <RoleItem
          role={mockRole}
          roleDetails={mockRoleDetails}
          hoveredRole="admin"
          setHoveredRole={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      unmountRole();

      // Test GroupItem
      const { unmount: unmountGroup } = render(
        <GroupItem
          group={mockGroup}
          groupDetails={mockGroupDetails}
          hoveredGroup="group123"
          setHoveredGroup={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Complete JSON Data')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      unmountGroup();
    });

    it('all components handle modal close correctly', () => {
      // Test DatabaseItem
      const { unmount: unmountDb } = render(
        <DatabaseItem
          database={mockDatabase}
          databaseDetails={mockDatabaseDetails}
          hoveredDatabase="db123"
          setHoveredDatabase={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Database Details:')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      expect(screen.queryByText('Database Details:')).not.toBeInTheDocument();
      unmountDb();

      // Test ServerItem
      const { unmount: unmountServer } = render(
        <ServerItem
          server={mockServer}
          serverDetails={mockServerDetails}
          hoveredServer="server123"
          setHoveredServer={mockSetHovered}
        />,
      );
      fireEvent.click(screen.getByText('Show Details'));
      expect(screen.getByText('Server Details:')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Close'));
      expect(screen.queryByText('Server Details:')).not.toBeInTheDocument();
      unmountServer();
    });
  });

  describe('Component-specific modal content validation', () => {
    it('DatabaseItem shows database-specific properties in modal', () => {
      render(
        <DatabaseItem
          database={mockDatabase}
          databaseDetails={mockDatabaseDetails}
          hoveredDatabase="db123"
          setHoveredDatabase={mockSetHovered}
        />,
      );

      fireEvent.click(screen.getByText('Show Details'));

      // Should show database properties in modal
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText(/Database Name/)).toBeInTheDocument();
      expect(within(modal).getByText(/Enabled/)).toBeInTheDocument();
    });

    it('ServerItem shows server-specific properties in modal', () => {
      render(
        <ServerItem
          server={mockServer}
          serverDetails={mockServerDetails}
          hoveredServer="server123"
          setHoveredServer={mockSetHovered}
        />,
      );

      fireEvent.click(screen.getByText('Show Details'));

      // Should show server properties in modal
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText(/Nameref/)).toBeInTheDocument();
      expect(within(modal).getByText(/Kindref/)).toBeInTheDocument();
    });

    it('UserItem shows user-specific properties in modal', () => {
      render(
        <UserItem
          user={mockUser}
          userDetails={mockUserDetails}
          hoveredUser="admin"
          setHoveredUser={mockSetHovered}
        />,
      );

      fireEvent.click(screen.getByText('Show Details'));

      // Should show user properties in modal
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText(/User Details/)).toBeInTheDocument();
    });

    it('ForestItem shows forest-specific properties in modal', () => {
      render(
        <ForestItem
          forest={mockForest}
          forestDetails={mockForestDetails}
          hoveredForest="forest123"
          setHoveredForest={mockSetHovered}
        />,
      );

      fireEvent.click(screen.getByText('Show Details'));

      // Should show forest properties in modal
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText(/Forest Properties/)).toBeInTheDocument();
    });

    it('RoleItem shows role-specific properties in modal', () => {
      render(
        <RoleItem
          role={mockRole}
          roleDetails={mockRoleDetails}
          hoveredRole="admin"
          setHoveredRole={mockSetHovered}
        />,
      );

      fireEvent.click(screen.getByText('Show Details'));

      // Should show role properties in modal - look within the modal content
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Check for role-specific content within the modal
      expect(within(modal).getByText(/Role Name/)).toBeInTheDocument();
      expect(within(modal).getByText(/Description/)).toBeInTheDocument();
      expect(within(modal).getByText(/Privileges/)).toBeInTheDocument();
    });

    it('GroupItem shows group-specific properties in modal', () => {
      render(
        <GroupItem
          group={mockGroup}
          groupDetails={mockGroupDetails}
          hoveredGroup="group123"
          setHoveredGroup={mockSetHovered}
        />,
      );

      fireEvent.click(screen.getByText('Show Details'));

      // Should show group properties in modal
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText(/Group Details/)).toBeInTheDocument();
    });
  });
});
