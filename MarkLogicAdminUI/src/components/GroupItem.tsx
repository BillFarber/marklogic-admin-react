import React from 'react';
import { DetailsModal } from './DetailsModal';

interface GroupItemProps {
  group: any;
  groupDetails: Record<string, any>;
  hoveredGroup: string | null;
  setHoveredGroup: (group: string | null) => void;
}

export const GroupItem = React.memo(function GroupItem({
  group,
  groupDetails,
  hoveredGroup,
  setHoveredGroup,
}: GroupItemProps) {
  const isHovered = hoveredGroup === group.idref;
  const [hoverTimeout, setHoverTimeout] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredGroup(group.idref);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredGroup(null);
    }, 300);
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
      setHoveredGroup(null);
    }, 100);
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
      key={group.nameref}
      data-idref={group.idref}
      style={{
        marginBottom: '8px',
        position: 'relative',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: isHovered ? '#5a6c7d' : 'transparent', // Lighter blue-grey to match servers
        transition: 'background-color 0.2s ease',
      }}
    >
      <strong
        style={{
          cursor: 'pointer',
          color: isHovered ? '#bdc3c7' : '#fff', // Soft blue-grey accent to match servers
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {group.nameref}
      </strong>
      <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
        ID: {group.idref || 'N/A'}
      </div>

      {/* Detailed hover tooltip */}
      {isHovered && groupDetails[group.nameref] && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '100%',
            marginLeft: '10px',
            backgroundColor: '#8b6914', // Amber/golden background
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            minWidth: '350px',
            maxWidth: '500px',
            fontSize: '0.85em',
            lineHeight: '1.4',
            border: '1px solid #555',
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
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

          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#FF7043', fontSize: '1.1em' }}>
              {group.nameref}
            </strong>
          </div>

          {groupDetails[group.nameref] && (
            <div style={{ display: 'grid', gap: '8px' }}>
              {/* Basic Group Information */}
              <div>
                <strong style={{ color: '#4FC3F7' }}>ID:</strong>{' '}
                {groupDetails[group.nameref]['group-properties']?.[
                  'group-id'
                ] || group.idref}
              </div>
              <div>
                <strong style={{ color: '#4FC3F7' }}>Name:</strong>{' '}
                {groupDetails[group.nameref]['group-properties']?.[
                  'group-name'
                ] || group.nameref}
              </div>

              {/* Path information */}
              {groupDetails[group.nameref]['group-properties']?.[
                'modules-root'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>Modules Root:</strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'modules-root'
                    ]
                  }
                </div>
              )}

              {groupDetails[group.nameref]['group-properties']?.['root'] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>Root:</strong>{' '}
                  {groupDetails[group.nameref]['group-properties']['root']}
                </div>
              )}

              {groupDetails[group.nameref]['group-properties']?.[
                'http-user-agent'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>HTTP User Agent:</strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'http-user-agent'
                    ]
                  }
                </div>
              )}

              {/* Cache information */}
              {groupDetails[group.nameref]['group-properties']?.[
                'list-cache-size'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>List Cache Size:</strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'list-cache-size'
                    ]
                  }
                </div>
              )}

              {groupDetails[group.nameref]['group-properties']?.[
                'tree-cache-size'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>Tree Cache Size:</strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'tree-cache-size'
                    ]
                  }
                </div>
              )}

              {groupDetails[group.nameref]['group-properties']?.[
                'triple-cache-size'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>
                    Triple Cache Size:
                  </strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'triple-cache-size'
                    ]
                  }
                </div>
              )}

              {/* Timeout information */}
              {groupDetails[group.nameref]['group-properties']?.[
                'smtp-timeout'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>SMTP Timeout:</strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'smtp-timeout'
                    ]
                  }
                </div>
              )}

              {groupDetails[group.nameref]['group-properties']?.[
                'xdqp-timeout'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>XDQP Timeout:</strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'xdqp-timeout'
                    ]
                  }
                </div>
              )}

              {groupDetails[group.nameref]['group-properties']?.[
                'host-timeout'
              ] && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>Host Timeout:</strong>{' '}
                  {
                    groupDetails[group.nameref]['group-properties'][
                      'host-timeout'
                    ]
                  }
                </div>
              )}

              {/* Performance information */}
              {groupDetails[group.nameref]['group-properties']?.[
                'metering-enabled'
              ] !== undefined && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>
                    Metering Enabled:
                  </strong>{' '}
                  {groupDetails[group.nameref]['group-properties'][
                    'metering-enabled'
                  ].toString()}
                </div>
              )}

              {groupDetails[group.nameref]['group-properties']?.[
                'performance-metering-enabled'
              ] !== undefined && (
                <div>
                  <strong style={{ color: '#4FC3F7' }}>
                    Performance Metering:
                  </strong>{' '}
                  {groupDetails[group.nameref]['group-properties'][
                    'performance-metering-enabled'
                  ].toString()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={group.nameref}
        data={{ ...group, groupDetails }}
        type="group"
      />
    </li>
  );
});
