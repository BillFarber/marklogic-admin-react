import React from 'react';
import {
  SecurityTab,
  DataTab,
  InfrastructureTab,
  LogsTab,
  AsyncErrorBoundary,
} from './components';
import { useDatabases } from './hooks/useDatabases';
import { useForests } from './hooks/useForests';
import { useServers } from './hooks/useServers';
import { useGroups } from './hooks/useGroups';
import { useHosts } from './hooks/useHosts';
import { useUsers } from './hooks/useUsers';
import { useRoles } from './hooks/useRoles';
import { useLogs } from './hooks/useLogs';
import { useHover } from './hooks/useHover';

function Admin() {
  // Use custom hooks for all data entities
  const {
    databases,
    databaseDetails,
    loading: databasesLoading,
    error: databasesError,
  } = useDatabases();
  const {
    forests,
    forestDetails,
    loading: forestsLoading,
    error: forestsError,
  } = useForests();
  const {
    servers,
    serverDetails,
    loading: serversLoading,
    error: serversError,
  } = useServers();
  const {
    groups,
    groupDetails,
    loading: groupsLoading,
    error: groupsError,
  } = useGroups();
  const {
    hosts,
    hostDetails,
    loading: hostsLoading,
    error: hostsError,
  } = useHosts();
  const {
    users,
    userDetails,
    loading: usersLoading,
    error: usersError,
  } = useUsers();
  const {
    roles,
    roleDetails,
    loading: rolesLoading,
    error: rolesError,
  } = useRoles();

  // Use custom hooks for logs and hover state
  const { logs, loading: logsLoading, error: logsError, fetchLogs } = useLogs();
  const {
    hoveredDatabase,
    hoveredForest,
    hoveredServer,
    hoveredGroup,
    hoveredHost,
    hoveredUser,
    hoveredRole,
    setHoveredDatabase,
    setHoveredForest,
    setHoveredServer,
    setHoveredGroup,
    setHoveredHost,
    setHoveredUser,
    setHoveredRole,
  } = useHover();

  // Local state for active tab
  const [activeTab, setActiveTab] = React.useState<string>('infrastructure');

  React.useEffect(() => {
    document.title = 'MarkLogic Admin';
  }, []);

  // Combine loading states from all hooks
  const isLoading =
    databasesLoading ||
    forestsLoading ||
    serversLoading ||
    groupsLoading ||
    hostsLoading ||
    usersLoading ||
    rolesLoading ||
    logsLoading;

  // Combine error states from all hooks
  const combinedError =
    [
      databasesError,
      forestsError,
      serversError,
      groupsError,
      hostsError,
      usersError,
      rolesError,
      logsError,
    ]
      .filter(Boolean)
      .join('; ') || null;

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>MarkLogic Admin (Proxy)</h1>
      <p>Welcome to the admin page using Spring Boot proxy.</p>

      {/* Loading and Error States */}
      {isLoading && (
        <div style={{ marginBottom: '1rem' }}>
          <div>Loading database details...</div>
          <div>Loading forests...</div>
          <div>Loading servers...</div>
          <div>Loading groups...</div>
          <div>Loading hosts...</div>
          <div>Loading users...</div>
          <div>Loading roles...</div>
          {logsLoading && <div>Loading logs...</div>}
        </div>
      )}
      {combinedError && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {combinedError}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ margin: '2rem auto', maxWidth: 1000 }}>
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #ddd',
            marginBottom: '1rem',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setActiveTab('infrastructure')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor:
                activeTab === 'infrastructure' ? '#2c3e50' : '#f5f5f5', // Blue-grey to complement burgundy
              color: activeTab === 'infrastructure' ? '#fff' : '#333',
              cursor: 'pointer',
              borderBottom:
                activeTab === 'infrastructure' ? 'none' : '2px solid #ddd',
              fontWeight: activeTab === 'infrastructure' ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              marginRight: '4px',
            }}
          >
            Infrastructure (Servers & Groups)
          </button>
          <button
            onClick={() => setActiveTab('data')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'data' ? '#722f37' : '#f5f5f5', // Burgundy
              color: activeTab === 'data' ? '#fff' : '#333',
              cursor: 'pointer',
              borderBottom: activeTab === 'data' ? 'none' : '2px solid #ddd',
              fontWeight: activeTab === 'data' ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              marginRight: '4px',
            }}
          >
            Data (Databases & Forests)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'users' ? '#2d5016' : '#f5f5f5', // Deep forest green
              color: activeTab === 'users' ? '#fff' : '#333',
              cursor: 'pointer',
              borderBottom: activeTab === 'users' ? 'none' : '2px solid #ddd',
              fontWeight: activeTab === 'users' ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              marginRight: '4px',
            }}
          >
            Security (Users & Roles)
          </button>
          <button
            onClick={() => {
              setActiveTab('logs');
              // Fetch logs when the tab is clicked
              fetchLogs();
            }}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'logs' ? '#8B4513' : '#f5f5f5', // Brown for logs
              color: activeTab === 'logs' ? '#fff' : '#333',
              cursor: 'pointer',
              borderBottom: activeTab === 'logs' ? 'none' : '2px solid #ddd',
              fontWeight: activeTab === 'logs' ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
            }}
          >
            Logs
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ textAlign: 'left' }}>
          {activeTab === 'infrastructure' && (
            <AsyncErrorBoundary componentName="Infrastructure Tab">
              <InfrastructureTab
                servers={servers}
                serverDetails={serverDetails}
                hoveredServer={hoveredServer}
                setHoveredServer={setHoveredServer}
                groups={groups}
                groupDetails={groupDetails}
                hoveredGroup={hoveredGroup}
                setHoveredGroup={setHoveredGroup}
                hosts={hosts}
                hostDetails={hostDetails}
                hoveredHost={hoveredHost}
                setHoveredHost={setHoveredHost}
                onDatabaseClick={(_databaseName) => {
                  setActiveTab('data');
                  // Could add logic to highlight the specific database
                }}
              />
            </AsyncErrorBoundary>
          )}

          {activeTab === 'data' && (
            <AsyncErrorBoundary componentName="Data Tab">
              <DataTab
                databases={databases}
                databaseDetails={databaseDetails}
                forests={forests}
                forestDetails={forestDetails}
                hoveredDatabase={hoveredDatabase}
                setHoveredDatabase={setHoveredDatabase}
                hoveredForest={hoveredForest}
                setHoveredForest={setHoveredForest}
              />
            </AsyncErrorBoundary>
          )}

          {activeTab === 'users' && (
            <AsyncErrorBoundary componentName="Security Tab">
              <SecurityTab
                users={users}
                roles={roles}
                userDetails={userDetails}
                roleDetails={roleDetails}
                hoveredUser={hoveredUser}
                setHoveredUser={setHoveredUser}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
            </AsyncErrorBoundary>
          )}

          {activeTab === 'logs' && (
            <AsyncErrorBoundary componentName="Logs Tab">
              <LogsTab logs={logs} error={logsError} loading={logsLoading} />
            </AsyncErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
