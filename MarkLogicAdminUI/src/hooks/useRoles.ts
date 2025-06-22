import { useState, useEffect } from 'react';
import type { RoleListResponse, RoleDetailsMap } from '../types/marklogic';

interface UseRolesReturn {
    roles: RoleListResponse | null;
    roleDetails: RoleDetailsMap;
    loading: boolean;
    error: string | null;
}

export function useRoles(): UseRolesReturn {
    const [roles, setRoles] = useState<RoleListResponse | null>(null);
    const [roleDetails, setRoleDetails] = useState<RoleDetailsMap>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                setError(null);

                const rolesUrl = 'http://localhost:8080/manage/v2/roles?format=json';

                const response = await fetch(rolesUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setRoles(data);

                // Fetch details for each role using nameref
                if (data && Array.isArray(data['role-default-list']?.['list-items']?.['list-item'])) {
                    const roleList = data['role-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each role in parallel
                    const detailPromises = roleList
                        .filter((role: any) => role.nameref)
                        .map(async (role: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/roles/${role.nameref}/properties?format=json`;
                                const detailResponse = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (detailResponse.ok) {
                                    const detailData = await detailResponse.json();
                                    details[role.nameref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for role ${role.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setRoleDetails(details);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(`Roles: ${errorMessage}`);
                console.error('Error fetching roles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return {
        roles,
        roleDetails,
        loading,
        error
    };
}
