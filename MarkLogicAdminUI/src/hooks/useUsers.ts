import { useState, useEffect } from 'react';
import type { UserListResponse, UserDetailsMap } from '../types/marklogic';

interface UseUsersReturn {
    users: UserListResponse | null;
    userDetails: UserDetailsMap;
    loading: boolean;
    error: string | null;
}

export function useUsers(): UseUsersReturn {
    const [users, setUsers] = useState<UserListResponse | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetailsMap>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const usersUrl = 'http://localhost:8080/manage/v2/users?format=json';

                const response = await fetch(usersUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setUsers(data);

                // Fetch details for each user using nameref
                if (data && Array.isArray(data['user-default-list']?.['list-items']?.['list-item'])) {
                    const userList = data['user-default-list']['list-items']['list-item'];
                    const details: Record<string, any> = {};

                    // Fetch details for each user in parallel
                    const detailPromises = userList
                        .filter((user: any) => user.nameref)
                        .map(async (user: any) => {
                            try {
                                const detailUrl = `http://localhost:8080/manage/v2/users/${user.nameref}/properties?format=json`;
                                const detailResponse = await fetch(detailUrl, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });

                                if (detailResponse.ok) {
                                    const detailData = await detailResponse.json();
                                    details[user.nameref] = detailData;
                                }
                            } catch (err) {
                                console.warn(`Failed to fetch details for user ${user.nameref}:`, err);
                            }
                        });

                    await Promise.allSettled(detailPromises);
                    setUserDetails(details);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(`Users: ${errorMessage}`);
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return {
        users,
        userDetails,
        loading,
        error
    };
}
