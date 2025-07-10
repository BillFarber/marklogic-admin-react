import { useState, useEffect } from 'react';
import type { GroupListResponse, GroupDetailsMap } from '../types/marklogic';

interface UseGroupsReturn {
  groups: GroupListResponse | null;
  groupDetails: GroupDetailsMap;
  loading: boolean;
  error: string | null;
}

export function useGroups(): UseGroupsReturn {
  const [groups, setGroups] = useState<GroupListResponse | null>(null);
  const [groupDetails, setGroupDetails] = useState<GroupDetailsMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        const groupsUrl = 'http://localhost:8080/manage/v2/groups?format=json';

        const response = await fetch(groupsUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setGroups(data);

        // Fetch details for each group using nameref
        if (
          data &&
          Array.isArray(
            data['group-default-list']?.['list-items']?.['list-item'],
          )
        ) {
          const groupList =
            data['group-default-list']['list-items']['list-item'];
          const details: Record<string, any> = {};

          // Fetch details for each group in parallel
          const detailPromises = groupList
            .filter((group: any) => group.nameref)
            .map(async (group: any) => {
              try {
                const detailUrl = `http://localhost:8080/manage/v2/groups/${group.nameref}/properties?format=json`;
                const detailResponse = await fetch(detailUrl, {
                  method: 'GET',
                  headers: { Accept: 'application/json' },
                });

                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  details[group.nameref] = detailData;
                }
              } catch (err) {
                console.warn(
                  `Failed to fetch details for group ${group.nameref}:`,
                  err,
                );
              }
            });

          await Promise.allSettled(detailPromises);
          setGroupDetails(details);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Groups: ${errorMessage}`);
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return {
    groups,
    groupDetails,
    loading,
    error,
  };
}
