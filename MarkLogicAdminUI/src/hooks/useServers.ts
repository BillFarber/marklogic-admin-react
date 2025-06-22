import { useState, useEffect } from 'react';
import type { ServerListResponse, ServerDetailsMap } from '../types/marklogic';

interface UseServersReturn {
    servers: ServerListResponse | null;
    serverDetails: ServerDetailsMap;
    loading: boolean;
    error: string | null;
}

export function useServers(): UseServersReturn {
    const [servers, setServers] = useState<ServerListResponse | null>(null);
    const [serverDetails, setServerDetails] = useState<ServerDetailsMap>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServers = async () => {
            try {
                setLoading(true);
                setError(null);

                const serversUrl = 'http://localhost:8080/manage/v2/servers?format=json';

                const response = await fetch(serversUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setServers(data);

                // Fetch details for each server using nameref and groupnameref
                if (data && Array.isArray(data['server-default-list']?.['list-items']?.['list-item'])) {
                    const serverList = data['server-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each server in parallel
                    const detailPromises = serverList
                        .filter((server: any) => server.nameref && server.groupnameref)
                        .map(async (server: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/servers/${server.nameref}/properties?group-id=${server.groupnameref}&format=json`;
                                const detailResponse = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (detailResponse.ok) {
                                    const detailData = await detailResponse.json();
                                    details[server.nameref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for server ${server.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setServerDetails(details);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(`Servers: ${errorMessage}`);
                console.error('Error fetching servers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchServers();
    }, []);

    return {
        servers,
        serverDetails,
        loading,
        error
    };
}
