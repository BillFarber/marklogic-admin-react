import React from 'react';
import { UserItem } from './UserItem';

interface UsersSectionProps {
  users: any;
  userDetails: Record<string, any>;
  hoveredUser: string | null;
  setHoveredUser: (user: string | null) => void;
}

export const UsersSection = React.memo(function UsersSection({
  users,
  userDetails,
  hoveredUser,
  setHoveredUser,
}: UsersSectionProps) {
  if (
    !users ||
    !Array.isArray(users['user-default-list']?.['list-items']?.['list-item'])
  ) {
    return null;
  }

  const usersList = users['user-default-list']['list-items'][
    'list-item'
  ].filter((user: any) => user.nameref);

  return (
    <section style={{ margin: '2rem auto', maxWidth: 800, textAlign: 'left' }}>
      <h2>Users</h2>
      <ul
        style={{
          background: '#355e3b', // Rich forest green
          color: '#fff',
          padding: 16,
          borderRadius: 8,
          listStyle: 'none',
          margin: 0,
        }}
      >
        {usersList.map((user: any, idx: number) => (
          <UserItem
            key={user.nameref || idx}
            user={user}
            userDetails={userDetails}
            hoveredUser={hoveredUser}
            setHoveredUser={setHoveredUser}
          />
        ))}
      </ul>
    </section>
  );
});
