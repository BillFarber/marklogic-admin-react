import React from 'react';

import type { LogsTabProps } from '../types/marklogic';
import { LogsSection } from './LogsSection';

export function LogsTab({
    logs: initialLogs,
    error: initialError,
    loading: initialLoading
}: LogsTabProps) {
    const [logFiles, setLogFiles] = React.useState<string[]>([]);
    const [selectedLogFile, setSelectedLogFile] = React.useState<string>('ErrorLog.txt');
    const [logFilesLoading, setLogFilesLoading] = React.useState<boolean>(false);
    const [logFilesError, setLogFilesError] = React.useState<string | null>(null);

    // State for the actual log content
    const [logs, setLogs] = React.useState<any>(initialLogs);
    const [logsError, setLogsError] = React.useState<string | null>(initialError);
    const [logsLoading, setLogsLoading] = React.useState<boolean>(initialLoading);

    // Fetch list of available log files
    React.useEffect(() => {
        const fetchLogFiles = async () => {
            setLogFilesLoading(true);
            try {
                const response = await fetch('http://localhost:8080/manage/v2/logs?format=json', {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Parse the log files from the response
                if (data && data['log-files']) {
                    setLogFiles(data['log-files']);
                    setLogFilesError(null);
                } else {
                    // Fallback to common log files if the response format is unexpected
                    const fallbackFiles = [
                        'ErrorLog.txt',
                        'ErrorLog_1.txt',
                        'AuditLog.txt',
                        'AuditLog_1.txt',
                        'CrashLog.txt',
                        '7997_AccessLog.txt',
                        '7997_ErrorLog.txt',
                        '7997_RequestLog.txt',
                        '8000_AccessLog.txt',
                        '8000_ErrorLog.txt',
                        '8000_RequestLog.txt',
                        '8001_AccessLog.txt',
                        '8001_ErrorLog.txt',
                        '8001_RequestLog.txt',
                        '8002_AccessLog.txt',
                        '8002_ErrorLog.txt',
                        '8002_RequestLog.txt',
                        'TaskServer_ErrorLog.txt',
                        'TaskServer_RequestLog.txt'
                    ];
                    setLogFiles(fallbackFiles);
                }
            } catch (err: any) {
                setLogFilesError(err.message);
                // Set fallback files even on error
                const fallbackFiles = [
                    'ErrorLog.txt',
                    'ErrorLog_1.txt',
                    'AuditLog.txt',
                    'AuditLog_1.txt',
                    'CrashLog.txt'
                ];
                setLogFiles(fallbackFiles);
            } finally {
                setLogFilesLoading(false);
            }
        };

        fetchLogFiles();
    }, []);

    // Fetch log content when selected file changes
    React.useEffect(() => {
        const fetchLogContent = async () => {
            if (!selectedLogFile) return;

            setLogsLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/manage/v2/logs?filename=${selectedLogFile}&format=text`, {
                    method: 'GET',
                    headers: { 'Accept': 'text/plain' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const content = await response.text();
                setLogs(content);
                setLogsError(null);
            } catch (err: any) {
                setLogsError(err.message);
                setLogs(null);
            } finally {
                setLogsLoading(false);
            }
        };

        fetchLogContent();
    }, [selectedLogFile]);

    const handleLogFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLogFile(event.target.value);
    };

    return (
        <div>
            {/* Log file selection dropdown */}
            <div style={{
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <h3 style={{
                    color: '#8B4513',
                    marginBottom: '12px',
                    marginTop: '0px'
                }}>
                    📋 Select Log File
                </h3>

                {logFilesLoading ? (
                    <p>Loading available log files...</p>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label htmlFor="logfile-select" style={{ fontWeight: 'bold' }}>
                            Log File:
                        </label>
                        <select
                            id="logfile-select"
                            value={selectedLogFile}
                            onChange={handleLogFileChange}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                backgroundColor: '#fff',
                                fontSize: '14px',
                                minWidth: '200px'
                            }}
                        >
                            {logFiles.map((filename) => (
                                <option key={filename} value={filename}>
                                    {filename}
                                </option>
                            ))}
                        </select>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                            ({logFiles.length} files available)
                        </span>
                    </div>
                )}

                {logFilesError && (
                    <div style={{ color: 'orange', fontSize: '12px', marginTop: '8px' }}>
                        Warning: {logFilesError} (using fallback list)
                    </div>
                )}
            </div>

            {/* Main logs section */}
            <div style={{
                marginBottom: '20px'
            }}>
                <LogsSection
                    logs={logs}
                    error={logsError}
                    loading={logsLoading}
                    selectedLogFile={selectedLogFile}
                />
            </div>
        </div>
    );
}
