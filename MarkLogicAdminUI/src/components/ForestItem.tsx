import React from 'react';
import { DetailsModal } from './DetailsModal';

interface ForestItemProps {
  forest: any;
  forestDetails: Record<string, any>;
  hoveredForest: string | null;
  setHoveredForest: (forest: string | null) => void;
}

export const ForestItem = React.memo(function ForestItem({
  forest,
  forestDetails,
  hoveredForest,
  setHoveredForest,
}: ForestItemProps) {
  const isHovered = hoveredForest === forest.idref;
  const [hoverTimeout, setHoverTimeout] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredForest(forest.idref);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredForest(null);
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
      setHoveredForest(null);
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
      key={forest.nameref}
      data-idref={forest.idref}
      style={{
        marginBottom: '8px',
        position: 'relative',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: isHovered ? '#a0303e' : 'transparent', // Lighter burgundy to match databases
        transition: 'background-color 0.2s ease',
      }}
    >
      <strong
        style={{
          cursor: 'pointer',
          color: isHovered ? '#f8bbd9' : '#fff', // Soft burgundy-pink accent to match databases
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {forest.nameref}
      </strong>
      <div style={{ fontSize: '0.9em', color: '#ccc', marginTop: '4px' }}>
        Type: Forest | ID: {forest.idref || 'N/A'}
      </div>

      {/* Hover tooltip for forests */}
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
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
            <strong>Forest Details:</strong>
          </div>
          <div>
            <strong>Name:</strong> {forest.nameref}
          </div>
          <div>
            <strong>ID:</strong> {forest.idref || 'N/A'}
          </div>
          <div>
            <strong>URI:</strong> {forest.uriref || 'N/A'}
          </div>

          {forestDetails[forest.idref] &&
            (() => {
              const details = forestDetails[forest.idref];
              const properties = details['forest-properties'] || details;
              return (
                <>
                  <hr style={{ margin: '8px 0', borderColor: '#b8860b' }} />
                  <div>
                    <strong>Host:</strong> {properties.host || 'N/A'}
                  </div>
                  <div>
                    <strong>Enabled:</strong>{' '}
                    {properties.enabled ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Data Directory:</strong>{' '}
                    {properties['data-directory'] || 'N/A'}
                  </div>
                  {properties['large-data-directory'] && (
                    <div>
                      <strong>Large Data Directory:</strong>{' '}
                      {properties['large-data-directory']}
                    </div>
                  )}
                  {properties['fast-data-directory'] && (
                    <div>
                      <strong>Fast Data Directory:</strong>{' '}
                      {properties['fast-data-directory']}
                    </div>
                  )}
                  <div>
                    <strong>Updates Allowed:</strong>{' '}
                    {properties['updates-allowed'] || 'N/A'}
                  </div>
                  <div>
                    <strong>Availability:</strong>{' '}
                    {properties.availability || 'N/A'}
                  </div>
                  {properties['rebalancer-enable'] !== undefined && (
                    <div>
                      <strong>Rebalancer:</strong>{' '}
                      {properties['rebalancer-enable'] ? 'Enabled' : 'Disabled'}
                    </div>
                  )}
                  {properties.database && (
                    <div>
                      <strong>Database:</strong> {properties.database}
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
        title={forest.nameref}
        data={{ ...forest, forestDetails }}
        type="forest"
      />
    </li>
  );
});
