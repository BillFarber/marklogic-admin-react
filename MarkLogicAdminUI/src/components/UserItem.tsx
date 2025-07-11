import React from 'react';
import { DetailsModal } from './DetailsModal';

interface UserItemProps {
  user: any;
  userDetails: Record<string, any>;
  hoveredUser: string | null;
  setHoveredUser: (user: string | null) => void;
}

export const UserItem = React.memo(function UserItem({
  user,
  userDetails,
  hoveredUser,
  setHoveredUser,
}: UserItemProps) {
  const isHovered = hoveredUser === user.nameref;
  const [hoverTimeout, setHoverTimeout] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredUser(user.nameref);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredUser(null);
    }, 300); // 300ms delay before hiding
    setHoverTimeout(timeout);
  };

  const handleTooltipMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleTooltipMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredUser(null);
    }, 100); // Shorter delay when leaving tooltip
    setHoverTimeout(timeout);
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <li
      key={user.nameref}
      data-idref={user.idref}
      style={{
        marginBottom: '8px',
        position: 'relative',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: isHovered ? '#4a7c59' : 'transparent', // Lighter forest green on hover
        transition: 'background-color 0.2s ease',
      }}
    >
      <strong
        style={{
          cursor: 'pointer',
          color: isHovered ? '#a8d8a8' : '#fff', // Soft green accent on hover
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {user.nameref}
      </strong>
      <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
        Type: User | ID: {user.idref || 'N/A'}
        {user.description && ` | ${user.description}`}
      </div>

      {/* Hover tooltip for users */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            backgroundColor: '#8b6914', // Amber/golden background
            border: '1px solid #b8860b',
            borderRadius: '4px',
            padding: '8px',
            zIndex: 1000,
            minWidth: '300px',
            cursor: 'default',
            userSelect: 'text',
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Show Details Button */}
          <div
            style={{
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid #b8860b',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              style={{
                backgroundColor: '#fff',
                color: '#8b6914',
                border: '1px solid #b8860b',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.9em',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Show Details
            </button>
          </div>

          <div>
            <strong>User Details:</strong>
          </div>
          <div>
            <strong>Name:</strong> {user.nameref}
          </div>
          <div>
            <strong>ID:</strong> {user.idref || 'N/A'}
          </div>
          <div>
            <strong>URI:</strong> {user.uriref || 'N/A'}
          </div>
          {user.description && (
            <div>
              <strong>Description:</strong> {user.description}
            </div>
          )}

          {userDetails[user.nameref] &&
            (() => {
              const details = userDetails[user.nameref];
              return (
                <>
                  <hr style={{ margin: '8px 0', borderColor: '#d45a00' }} />
                  <div>
                    <strong>User Properties:</strong>
                  </div>
                  <div>
                    <strong>User Name:</strong> {details['user-name']}
                  </div>
                  {details.description && (
                    <div>
                      <strong>Description:</strong> {details.description}
                    </div>
                  )}
                  {details.role && Array.isArray(details.role) && (
                    <div>
                      <strong>Roles:</strong> {details.role.join(', ')}
                    </div>
                  )}
                  {details.role && !Array.isArray(details.role) && (
                    <div>
                      <strong>Role:</strong> {details.role}
                    </div>
                  )}
                  {details['external-names'] && (
                    <div>
                      <strong>External Names:</strong>{' '}
                      {JSON.stringify(details['external-names'])}
                    </div>
                  )}
                  {details.permissions && (
                    <div>
                      <strong>Permissions:</strong>{' '}
                      {JSON.stringify(details.permissions)}
                    </div>
                  )}
                  {details.collections && (
                    <div>
                      <strong>Collections:</strong>{' '}
                      {JSON.stringify(details.collections)}
                    </div>
                  )}
                </>
              );
            })()}
        </div>
      )}

      {/* Details Modal */}
      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={user.nameref}
        data={{ ...user, userDetails }}
        type="user"
      />
    </li>
  );
});
