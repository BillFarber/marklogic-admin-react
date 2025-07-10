import { useState } from 'react';
import type { LogsResponse } from '../types/marklogic';

export function useLogs() {
  const [logs, setLogs] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = () => {
    // Only fetch if not already loaded or loading
    if (!logs && !loading) {
      setLoading(true);
      fetch(
        'http://localhost:8080/manage/v2/logs?filename=ErrorLog.txt&format=text',
        {
          method: 'GET',
          headers: { Accept: 'text/plain' },
        },
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.text();
        })
        .then((data) => {
          setLogs(data);
          setError(null);
        })
        .catch((e) => {
          const errorMessage =
            e instanceof Error ? e.message : 'Unknown error occurred';
          setError(`Logs: ${errorMessage}`);
          console.error('Error fetching logs:', e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return {
    logs,
    loading,
    error,
    fetchLogs,
  };
}
