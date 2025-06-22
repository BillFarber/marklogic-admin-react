import React from 'react';
import { LogsSection } from './LogsSection';

interface LogsTabProps {
    logs: any;
    error: string | null;
    loading: boolean;
}

export function LogsTab({
    logs,
    error,
    loading
}: LogsTabProps) {
    return (
        <div>
            {/* Main logs section */}
            <div style={{
                marginBottom: '20px'
            }}>
                <LogsSection
                    logs={logs}
                    error={error}
                    loading={loading}
                />
            </div>
        </div>
    );
}
