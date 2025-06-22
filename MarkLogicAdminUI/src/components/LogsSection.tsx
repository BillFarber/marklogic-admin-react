import React from 'react';

interface LogsSectionProps {
    logs: any;
    error: string | null;
    loading: boolean;
    selectedLogFile?: string;
}

export const LogsSection = React.memo(function LogsSection({ logs, error, loading, selectedLogFile = 'ErrorLog.txt' }: LogsSectionProps) {
    if (loading) {
        return (
            <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd'
            }}>
                <h3 style={{
                    color: '#8B4513',
                    marginBottom: '16px',
                    borderBottom: '2px solid #8B4513',
                    paddingBottom: '8px'
                }}>
                    📋 Error Logs
                </h3>
                <p>Loading logs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd'
            }}>
                <h3 style={{
                    color: '#8B4513',
                    marginBottom: '16px',
                    borderBottom: '2px solid #8B4513',
                    paddingBottom: '8px'
                }}>
                    📋 Error Logs
                </h3>
                <div style={{ color: 'red' }}>Error loading logs: {error}</div>
            </div>
        );
    }

    if (!logs) {
        return (
            <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd'
            }}>
                <h3 style={{
                    color: '#8B4513',
                    marginBottom: '16px',
                    borderBottom: '2px solid #8B4513',
                    paddingBottom: '8px'
                }}>
                    📋 Error Logs
                </h3>
                <p>No logs available</p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
        }}>
            <h3 style={{
                color: '#8B4513',
                marginBottom: '16px',
                borderBottom: '2px solid #8B4513',
                paddingBottom: '8px'
            }}>
                📋 {selectedLogFile.includes('Error') ? 'Error Logs' :
                    selectedLogFile.includes('Access') ? 'Access Logs' :
                        selectedLogFile.includes('Request') ? 'Request Logs' :
                            selectedLogFile.includes('Audit') ? 'Audit Logs' :
                                selectedLogFile.includes('Crash') ? 'Crash Logs' : 'Logs'} ({selectedLogFile})
            </h3>

            <div style={{
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '12px',
                maxHeight: '400px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.4',
                whiteSpace: 'pre-wrap'
            }}>
                {typeof logs === 'string' ? logs : JSON.stringify(logs, null, 2)}
            </div>

            <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#666'
            }}>
                📅 Last updated: {new Date().toLocaleString()}
            </div>
        </div>
    );
});
