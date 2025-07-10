import { useState, useEffect } from 'react';
import type { ForestListResponse, ForestDetailsMap } from '../types/marklogic';

interface UseForestsReturn {
  forests: ForestListResponse | null;
  forestDetails: ForestDetailsMap;
  loading: boolean;
  error: string | null;
}

export function useForests(): UseForestsReturn {
  const [forests, setForests] = useState<ForestListResponse | null>(null);
  const [forestDetails, setForestDetails] = useState<ForestDetailsMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForests = async () => {
      try {
        setLoading(true);
        setError(null);

        const forestsUrl =
          'http://localhost:8080/manage/v2/forests?format=json';

        const response = await fetch(forestsUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setForests(data);

        // Fetch details for each forest using idref
        if (
          data &&
          Array.isArray(
            data['forest-default-list']?.['list-items']?.['list-item'],
          )
        ) {
          const forestList =
            data['forest-default-list']['list-items']['list-item'];
          const details: Record<string, any> = {};

          // Fetch details for each forest in parallel
          const detailPromises = forestList
            .filter((forest: any) => forest.idref)
            .map(async (forest: any) => {
              try {
                const detailUrl = `http://localhost:8080/manage/v2/forests/${forest.idref}/properties?format=json`;
                const detailResponse = await fetch(detailUrl, {
                  method: 'GET',
                  headers: { Accept: 'application/json' },
                });

                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  details[forest.idref] = detailData;
                }
              } catch (err) {
                console.warn(
                  `Failed to fetch details for forest ${forest.nameref}:`,
                  err,
                );
              }
            });

          await Promise.allSettled(detailPromises);
          setForestDetails(details);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Forests: ${errorMessage}`);
        console.error('Error fetching forests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForests();
  }, []);

  return {
    forests,
    forestDetails,
    loading,
    error,
  };
}
