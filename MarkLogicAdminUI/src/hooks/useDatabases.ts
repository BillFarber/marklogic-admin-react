import { useState, useEffect } from 'react';
import type { DatabaseListResponse, DatabaseDetailsMap } from '../types/marklogic';

export function useDatabases() {
    const [databases, setDatabases] = useState<DatabaseListResponse | null>(null);
    const [databaseDetails, setDatabaseDetails] = useState<DatabaseDetailsMap>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDatabases = async () => {
            try {
                setLoading(true);
                const databasesUrl = 'http://localhost:8080/manage/v2/databases';
                const response = await fetch(databasesUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setDatabases(data);

                // Fetch details for each database using idref
                if (data && Array.isArray(data['database-default-list']?.['list-items']?.['list-item'])) {
                    const dbList = data['database-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each database in parallel
                    const detailPromises = dbList
                        .filter((db: any) => db.idref)
                        .map(async (db: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/databases/${db.idref}/properties?format=json`;
                                const detailResponse = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (detailResponse.ok) {
                                    const detailData = await detailResponse.json();
                                    details[db.idref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for database ${db.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setDatabaseDetails(details);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchDatabases();
    }, []);

    return { databases, databaseDetails, loading, error };
}
